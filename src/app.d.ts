// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import { INDUSTRY_LIST_VALUES } from '$lib/constants'

declare global {
	namespace App {
		interface Job {
			title: string // title
			description: string // description
			employerTitle: string // **new**
			employerId: string // employer_id
			type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN' // job_type (full_time, part_time)
			applicationLink: string // application_link
			status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' // status (active, inactive, archived)
			industry: typeof INDUSTRY_LIST_VALUES // industry
			legacyId: string // id (legacy, left over from postgres days, needed?)
			renewedAt: string // renewed_at
			createdAt: string // created_at
			updatedAt: string // updated_at
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
