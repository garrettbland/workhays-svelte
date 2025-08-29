import type { IStaticMethods } from 'preline/dist'

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface Window {
		// Preline UI
		HSStaticMethods: IStaticMethods
	}
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			showJob?: boolean
		}
		// interface Platform {}
	}
}

export {}
