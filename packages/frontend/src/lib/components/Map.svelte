<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { XYZ } from 'ol/source';
	import { Map, View, Feature } from 'ol';
	import { Draw } from 'ol/interaction';
	import { Tile as TileLayer } from 'ol/layer';
	import { Vector as VectorLayer } from 'ol/layer';
	import { Vector as VectorSource } from 'ol/source';
	import { Icon, Style, Circle, Fill, Text } from 'ol/style';
	import { transform, toLonLat } from 'ol/proj';
	import { Point } from 'ol/geom';

	import { messages, waypoints, startingLocation } from '$lib/store';

	const tileCache = {};
	const vectorSource = new VectorSource({
		features: []
	});
	const tileLayer = new TileLayer({
		source: new XYZ({
			url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			tileUrlFunction: function (tileCoord, pixelRatio, projection) {
				const tileUrl = this.getTileUrl(tileCoord, pixelRatio, projection);
				const cacheKey = `${tileCoord[0]}-${tileCoord[1]}-${tileCoord[2]}`;
				if (!tileCache[cacheKey]) {
					tileCache[cacheKey] = tileUrl;
				}
				return tileCache[cacheKey];
			}
		})
	});
	const vectorLayer = new VectorLayer({
		source: vectorSource
	});

	const crossStyle = new Style({
		image: new Icon({
			anchor: [0.5, 0.5],
			anchorXUnits: 'fraction',
			anchorYUnits: 'fraction',
			src: 'data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/><path d="M12 12l-8 8 8 8 8-8z"/></svg>'
		})
	});

	const draw = new Draw({
		source: vectorSource,
		type: 'Point',
		style: crossStyle
	});
	let map;
	// let longitude = ;
	// let latitude = 34.11844295532757;
	const zoom = 18;
	let startLocation = transform(
		[$startingLocation.longitude, $startingLocation.latitude],
		'EPSG:4326',
		'EPSG:3857'
	);
	let startFeature = new Feature(new Point(startLocation));
	startFeature.setStyle(
		new Style({
			image: new Circle({
				radius: 4,
				fill: new Fill({
					color: 'blue'
				})
			}),
			text: new Text({
				text: 'Starting Location',
				font: '14px Calibri,sans-serif',
				fill: new Fill({
					color: 'black'
				}),
				offsetX: 15,
				offsetY: -15
			})
		})
	);

	export function clearVectorSource() {
		vectorSource.clear();
		vectorSource.changed();
		// vectorSource.addFeature(startFeature);
	}

	export function updateStartLoc(longitude: string, latitude: string) {
		vectorSource.clear();
		startLocation = transform(
			[parseFloat(longitude), parseFloat(latitude)],
			'EPSG:4326',
			'EPSG:3857'
		);
		console.log('start location is' + startLocation);
		const point = new Point(startLocation);
		const newFeature = new Feature(point);
		newFeature.setStyle(
			new Style({
				image: new Circle({
					radius: 4,
					fill: new Fill({
						color: 'blue'
					})
				}),
				text: new Text({
					text: 'Starting Location',
					font: '14px Calibri,sans-serif',
					fill: new Fill({
						color: 'black'
					}),
					offsetX: 15,
					offsetY: -15
				})
			})
		);
		vectorLayer.getSource().refresh();
		vectorSource.addFeature(newFeature);
		map.getView().setCenter(startLocation);
		map.getView().setZoom(17);
		map.updateSize();
		map.getView().changed();
		vectorSource.changed();
		map.render();
		map.addInteraction(draw);
		waypoints.set([]);
		map.on('click', (event) => {
			const coordinates = event.coordinate;
			const lonLat = toLonLat(coordinates);
			const latitude = lonLat[1];
			const longitude = lonLat[0];
			console.log(lonLat);
			$waypoints.push({ latitude: latitude, longitude: longitude });
		});
	}

	function initMap(startLocation) {
		map = new Map({
			target: 'map',
			layers: [tileLayer, vectorLayer],
			view: new View({
				center: startLocation,
				zoom: zoom
			})
		});
		map.addInteraction(draw);
		map.on('click', (event) => {
			const coordinates = event.coordinate;
			const lonLat = toLonLat(coordinates);
			const latitude = lonLat[1];
			const longitude = lonLat[0];
			console.log(lonLat);
			$waypoints.push({ latitude: latitude, longitude: longitude });
		});

		vectorSource.addFeature(startFeature);

		map.updateSize();
		map.getView().setCenter(startLocation);
		window.addEventListener('resize', () => {
			map.updateSize();
		});
	}

	onMount(() => {
		initMap(startLocation);
	});

	$: {
		messages.subscribe((newMessages) => {
			const latest = newMessages[newMessages.length - 1];
			if (latest) {
				const point = transform([latest.longitude, latest.latitude], 'EPSG:4326', 'EPSG:3857');
				const pointFeature = new Feature(new Point(point));

				const circleStyle = new Style({
					image: new Circle({
						radius: 5,
						fill: new Fill({
							color: 'red'
						})
					})
				});

				pointFeature.setStyle(circleStyle);
				vectorSource.addFeature(pointFeature);
				vectorSource.changed();
			}
		});
	}
</script>

<map />
