<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as maplibre from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { telemetry, waypoints, startLocation } from '$lib/store';

	export let map;
	let mapContainer;

	onMount(() => {
		map = new maplibre.Map({
			center: [$startLocation.lon, $startLocation.lat],
			zoom: $startLocation.zoom,
			container: mapContainer,
			pitch: $startLocation.pitch,
			hash: false,
			style: 'https://tiles.openfreemap.org/styles/liberty',
			attributionControl: false,
			// style: {
			// 	version: 8,
			// 	sources: {
			// 		osm: {
			// 			type: 'raster',
			// 			tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
			// 			tileSize: 256,
			// 			attribution: '&copy; OpenStreetMap Contributors',
			// 			maxzoom: 19
			// 		},
			// 		// Use a different source for terrain and hillshade layers, to improve render quality
			// 		terrainSource: {
			// 			type: 'raster-dem',
			// 			url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
			// 			tileSize: 256
			// 		},
			// 		hillshadeSource: {
			// 			type: 'raster-dem',
			// 			url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
			// 			tileSize: 256
			// 		}
			// 	},
			// 	layers: [
			// 		{
			// 			id: 'osm',
			// 			type: 'raster',
			// 			source: 'osm'
			// 		},
			// 		{
			// 			id: 'hills',
			// 			type: 'hillshade',
			// 			source: 'hillshadeSource',
			// 			layout: { visibility: 'visible' },
			// 			paint: { 'hillshade-shadow-color': '#473B24' }
			// 		}
			// 	],
			// 	terrain: {
			// 		source: 'terrainSource',
			// 		exaggeration: 1
			// 	},
			// 	sky: {}
			// },
			maxZoom: 18,
			maxPitch: 85
		});

		map.addControl(
			new maplibre.NavigationControl({
				visualizePitch: true,
				showZoom: true,
				showCompass: true
			})
		);

		map.addControl(
			new maplibre.TerrainControl({
				source: 'terrainSource',
				exaggeration: 1
			})
		);

		// const iconStartLoc = document.createElement('div');
		// iconStartLoc.className = 'marker';
		// iconStartLoc.style.width = `10px`;
		// iconStartLoc.style.height = `10px`;
		new maplibre.Marker({ scale: 0.75 })
			.setLngLat([$startLocation.lon, $startLocation.lat])
			.addTo(map);

		map.on('mousedown', (e) => {
			if (e.originalEvent.ctrlKey) {
				const coordinates = e.lngLat;
				console.log(coordinates);
				const marker = new maplibre.Marker({ color: 'green', scale: 0.75 })
					.setLngLat(coordinates)
					.addTo(map);
				$waypoints = [...$waypoints, marker];
			}
		});
	});

	export function recenter(initalState: { lat: number; lon: number; zoom: number; pitch: number }) {
		map.jumpTo({
			center: [initalState.lon, initalState.lat],
			zoom: initalState.zoom,
			pitch: initalState.pitch
		});
	}

	export function clearMap() {
		$waypoints.forEach((marker) => {
			marker.remove();
		});
	}

	$: {
		telemetry.subscribe((newMessages) => {
			const latest = newMessages[newMessages.length - 1];
			if (latest) {
				const marker = new maplibre.Marker({ color: 'red', scale: 0.75 })
					.setLngLat([latest.longitude, latest.latitude])
					.addTo(map);
				$waypoints = [...$waypoints, marker];
			}
		});
	}

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="map-wrap">
	<div class="map" bind:this={mapContainer}></div>
</div>

<style>
	:root {
		font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
		font-size: 16px;
		line-height: 24px;
		font-weight: 400;

		color: #0f0f0f;
		background-color: #f6f6f6;

		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;
	}

	.map-wrap {
		position: relative;
		width: 100%;
		height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
	}

	.map {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			color: #f6f6f6;
			background-color: #2f2f2f;
		}
	}

	.iconStartLoc {
		height: 69px;
		width: 47px;
		background-image: url(https://api.geoapify.com/v1/icon/?type=awesome&scaleFactor=2&color=%2372a2d4&size=x-large&icon=plane-departure&apiKey=YOUR_API_KEY);
		background-size: contain;
		cursor: pointer;
	}
</style>
