import type { DroneTelemetry } from '@public/core/src/drone';
import { writable, type Writable } from 'svelte/store';
import type { Marker } from 'maplibre-gl';

export const telemetry: Writable<DroneTelemetry[]> = writable([]);
export const mapStore = writable({ clearMap: false });
export const waypoints: Writable<Marker[]> = writable([]);
export const startLocation = writable({
	lon: -118.30037365053812,
	lat: 34.118558653962666,
	// lat: 47.27574,
	// lon: 11.39085,
	zoom: 17,
	pitch: 15,
	altitude: 0
});

export const featureFlags = {
	private: false,
	dashboard: false
};
