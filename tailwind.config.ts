import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import prelinePlugin from 'preline/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/preline/preline.js'],
	theme: {
		extend: {}
	},
	plugins: [typography, forms, prelinePlugin]
} satisfies Config;
