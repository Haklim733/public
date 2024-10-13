import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

async function getConfig() {
	return defineConfig({
		plugins: [sveltekit()],
		resolve: {}
	});
}

export default getConfig;
