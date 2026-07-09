import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      strict: true,
      precompress: true
    }),
    alias: {
      $demo: 'src/demo'
    },
    prerender: {
      handleHttpError: ({ status, path }) => {
        if (status === 404 && path === '/missing-article-99999') return;
        throw new Error(`${status} ${path}`);
      }
    }
  }
};

export default config;
