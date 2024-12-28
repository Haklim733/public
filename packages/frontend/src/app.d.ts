// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
type User = {
	isAuthenticated: boolean;
	sessionId: string | undefined;
	properties: Record<string, any>;
};

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			stage: string;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
	}
}
