import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	define: {
		'import.meta.vitest': 'undefined'
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		includeSource: ['src/**/*.{js,ts}']
	}
};

export default config;
