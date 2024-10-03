import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

async function getConfig() {
  const sveltekitPlugin = await sveltekit();

  return defineConfig({
    plugins: [sveltekitPlugin],
    resolve: {
      alias: {
        '@mockIot/core': path.resolve(__dirname, '../core/src')
      }
    }
  });
}

export default getConfig;