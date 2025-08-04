import { INDUSTRIES, JOB_TYPES, JOB_STATUSES } from '$lib/constants'
import { Timestamp } from 'firebase/firestore'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase-admin/firestore'
import type { JSONContent } from '@tiptap/core'

interface CommonDocument {
	createdAt: Timestamp // created_at
	updatedAt: Timestamp // updated_at
}

export interface Job extends CommonDocument {
	title: string // title
	description: JSONContent // description content from tip tap is JSON basically
	employerTitle: string // **new**
	employerId: string // employer_id
	type: JOB_TYPES // job_type (full_time, part_time)
	applicationLink?: string // application_link
	status: JOB_STATUSES // status (active, inactive, archived)
	industry: INDUSTRIES // industry
	isDeleted: boolean
	deletedAt?: Timestamp
	expiresAt: Timestamp // expires_at
	// renewedAt: string // renewed_at (!!! Not migrating from legacy !!!)
}

/**
 * Extra type that extends job so we can add the document id when querying
 */
export interface JobWithID extends Job {
	id: string
}

/**
 * Job inputs
 */
export type JobInputs = Omit<Job, 'createdAt' | 'updatedAt'>

export interface Employer extends CommonDocument {
	// id: string
	title: string
	description: JSONContent // TO DO: make sure we convert this from SQL along with job descriptions
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

/**
 * Extra type that extends employer so we can add the document id when querying
 */
export interface EmployerWithID extends Employer {
	id: string
}

export interface User extends CommonDocument {
	// id: string
	uid: string // needed? This is also stored
	firstName: string
	lastName: string
	email: string // needed? email is in firebase auth object
	// password: string
	// password_reset_token: string
	// password_reset_token_expires: string
	// status: 'pending' | 'verified' | 'locked'
	role: 'USER' | 'MODERATOR' | 'ADMIN'
	// last_login: string
	// employer_id_claim_request: string
	memberOf: string[] // employer ID's that the user is a member of
	emailVerificationCode?: string // this is the unique id used in email to verify
	emailVerified: boolean // if true, user clicked unique link in their email
}

/**
 * Extra type that extends user so we can add the document id when querying
 */
export interface UserWithID extends User {
	id: string
}

/**
 * Form Status
 */
export type FormStatus = 'IDLE' | 'LOADING' | 'SUCCESSFUL' | 'ERROR'

export {}
