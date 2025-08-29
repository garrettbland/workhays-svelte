import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'
import prelinePlugin from 'preline/plugin'

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/preline/preline.js'],
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						// Sets margin on top and bottom of the first and last child
						'h1, h2, h3, h4, h5, h6, p, ul, ol, pre, blockquote': {
							'&:first-child': {
								marginTop: '0'
							},
							'&:last-child': {
								marginBottom: '0'
							}
						}
					}
				}
			}
		}
	},
	plugins: [typography, prelinePlugin]
} satisfies Config
