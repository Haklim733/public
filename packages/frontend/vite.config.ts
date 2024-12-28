import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

async function getConfig() {
	return defineConfig({
		plugins: [sveltekit()],
		resolve: {
			alias: {
				'@public/core/*': '../core/src/*',
				'@public/core': '../core/src'
			}
		}
	});
}

export default getConfig;
