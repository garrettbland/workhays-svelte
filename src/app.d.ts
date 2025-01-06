// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	namespace App {
		interface Job {
			_id: string; // firebase document id. Not in document, added later
			id: string; // unique id, not sure if needed
			title: string;
			description: string;
			employerTitle: string;
			employerId: string;
			createdAt: string;
			updatedAt: string;
			type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN';
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
