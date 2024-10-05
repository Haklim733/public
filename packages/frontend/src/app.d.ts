// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: {
				isAuthenticated: boolean;
				sessionId: string | undefined;
				properties: Object;
			};
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
	}
}