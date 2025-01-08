import { INDUSTRY_LIST_VALUES } from '$lib/constants'

export interface Job {
	title: string // title
	description: string // description
	employerTitle: string // **new**
	employerId: string // employer_id
	type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN' // job_type (full_time, part_time)
	applicationLink: string // application_link
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' // status (active, inactive, archived)
	industry: typeof INDUSTRY_LIST_VALUES // industry
	legacyId?: string // id (legacy, only on records migrated)
	renewedAt: string // renewed_at
	createdAt: string // created_at
	updatedAt: string // updated_at
}

export interface Employer {
	// id: string
	title: string
	description: string
	user_id: string // legacy
	users: [
		{
			userId: string
			role: 'MEMBER' | 'ADMIN' | 'OWNER'
			status: 'INVITED' | 'ACCEPTED'
		}
	]
	contact: string
	email: string
	phone: string
	logo_url: string
	header_image_url: string
	website_url: string
	facebook_url: string
	twitter_url: string
	instagram_url: string
	youtube_url: string
	legacyId?: string // id (legacy, only on records migrated)
	createdAt: string
	updatedAt: string
}

export interface User {
	// id: string
	uid: string
	firstName: string
	lastLame: string
	email: string
	// password: string
	// password_reset_token: string
	// password_reset_token_expires: string
	// status: 'pending' | 'verified' | 'locked'
	role: 'USER' | 'MODERATOR' | 'ADMIN'
	// last_login: string
	legacyId?: string // id (legacy, only on records migrated)
	createdAt: string
	updatedAt: string
	// employer_id_claim_request: string
}

export {}
