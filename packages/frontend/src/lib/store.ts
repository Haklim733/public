import { writable } from 'svelte/store';

export const telemetry = writable([]);
export const mapStore = writable({ clearMap: false });
export const waypoints = writable([]);
export const startLocation= writable({
		lon: -118.30037365053812,
		lat: 34.118558653962666,
		// lat: 47.27574,
		// lon: 11.39085,
		zoom: 17,
		pitch: 15,
		altitude: 0
});
