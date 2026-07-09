import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    watch: {
      // adapter-static writes here; watching it triggers full page reloads during dev
      ignored: ['**/build/**', '**/dist/**']
    }
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
