import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

async function getConfig() {
	return defineConfig({
		plugins: [sveltekit()],
		resolve: {},
		optimizeDeps: {
			exclude: [
				'mqtt',
				'ts-deepmerg',
				'nanoid/non-secure',
				'dequal',
				'@floating-ui/dom',
				'focus-trap'
			] // Exclude the core package from pre-bundling
		}
	});
}

export default getConfig;
