import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

async function getConfig() {
	return defineConfig({
		plugins: [sveltekit()],
		resolve: {
			alias: {
				'@public/core': path.resolve('../core/src')
			}
		}
	});
}

export default getConfig;
