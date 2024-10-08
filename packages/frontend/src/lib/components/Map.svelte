<script lang="ts">
	import { onMount } from 'svelte';
	import { XYZ } from 'ol/source';
	import { Map, View, Feature } from 'ol';
	import { Tile as TileLayer } from 'ol/layer';
	import { Vector as VectorLayer } from 'ol/layer';
	import { Vector as VectorSource } from 'ol/source';
	import { Style, Circle, Fill, Text } from 'ol/style';
	import { transform } from 'ol/proj';
	import { Point } from 'ol/geom';
	import { messages } from '$lib/store';

	const tileCache = {};

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

	let map;
	let vectorLayer;
	let vectorSource;
	const zoom = 18;
	let startingX = -118.30049006438229;
	let startingY = 34.11844295532757;
	let startLocation = transform([startingX, startingY], 'EPSG:4326', 'EPSG:3857');
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
				text: 'Griffith Observatory',
				font: '14px Calibri,sans-serif',
				fill: new Fill({
					color: 'black'
				}),
				offsetX: 15,
				offsetY: -15
			})
		})
	);
	function clearVectorSource() {
		vectorSource.clear();
		vectorSource.addFeature(startFeature);
		vectorSource.changed();
	}

	export { clearVectorSource };

	vectorSource = new VectorSource();
	vectorLayer = new VectorLayer({
		source: vectorSource
	});

	onMount(() => {
		map = new Map({
			target: 'map',
			layers: [
				new TileLayer({
					source: new XYZ({
						url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					})
				}),
				vectorLayer
			],
			view: new View({
				center: startLocation,
				zoom: zoom
			})
		});

		vectorSource.addFeature(startFeature);

		map.updateSize();
		window.addEventListener('resize', () => {
			map.updateSize();
		});
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

<div id="map" style="width: 100%; height: 600px;"></div>
