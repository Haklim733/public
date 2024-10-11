import { writable } from 'svelte/store';

export const messages = writable([]);
export const mapStore = writable({ clearMap: false });
export const waypoints = writable([]);
