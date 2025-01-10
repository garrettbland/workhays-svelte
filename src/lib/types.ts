import { INDUSTRY_LIST_VALUES } from '$lib/constants'
import { Timestamp } from 'firebase/firestore'

interface CommonDocument {
	createdAt: typeof Timestamp // created_at
	updatedAt: typeof Timestamp // updated_at
}

export interface Job extends CommonDocument {
	title: string // title
	description: string // description
	employerTitle: string // **new**
	employerId: string // employer_id
	type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN' // job_type (full_time, part_time)
	applicationLink: string // application_link
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' // status (active, inactive, archived)
	industry: typeof INDUSTRY_LIST_VALUES // industry
	// renewedAt: string // renewed_at (!!! Not migrating from legacy !!!)
}

export interface Employer extends CommonDocument {
	// id: string
	title: string
	description: string
	users: {
		userId: string
		role: 'MEMBER' | 'ADMIN' | 'OWNER'
		status: 'INVITED' | 'ACCEPTED'
	}[]
	status: 'PENDING' | 'APPROVED' | 'DENIED'
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
}

export interface User extends CommonDocument {
	// id: string
	uid: string
	firstName: string
	lastName: string
	email: string
	// password: string
	// password_reset_token: string
	// password_reset_token_expires: string
	// status: 'pending' | 'verified' | 'locked'
	role: 'USER' | 'MODERATOR' | 'ADMIN'
	// last_login: string
	// employer_id_claim_request: string
}

export {}
