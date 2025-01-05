import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	assetsInclude: ['**/*.md'], // Added this line
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
