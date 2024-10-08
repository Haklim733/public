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

	let map;
	let vectorLayer;
	let vectorSource;
	let startingX = -118.30813539;
	let startingY = 34.1186197;
	let startLocation = transform([startingX, startingY], 'EPSG:4326', 'EPSG:3857');
	let center = startLocation;
	let radius = 1000; // 10k in meters
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
				center: center,
				zoom: 16
			})
		});

		vectorSource.addFeature(startFeature);
	});

	$: {
		messages.subscribe((newMessages) => {
			const latest = newMessages[newMessages.length - 1];
			console.log(latest);
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
				console.log('Added feature to vectorSource:', vectorSource.getFeatures());
				vectorSource.changed();
			}
		});
	}
</script>

<div id="map" style="width: 100%; height: 600px;"></div>
