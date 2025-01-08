export interface OldJob {
	id: string
	title: string
	description: string
	employer_id: string
	job_type: 'full_time' | 'part_time'
	application_link: string
	status: 'active' | 'inactive' | 'archived'
	industry: string
	renewed: string
	created_at: string
	updated_at: string
}

export interface OldJobWithEmployerTitle extends OldJob {
	employer_title: string
}

export interface OldEmployer {
	id: string
	user_id: string
	title: string
	description: string
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
	created_at: string
	updated_at: string
}

export interface OldUser {
	id: string
	first_name: string
	last_name: string
	email: string
	password: string
	password_reset_token: string
	password_reset_token_expires: string
	status: 'pending' | 'verified' | 'locked'
	role: 'moderator' | 'employer' | 'admin'
	last_login: string
	created_at: string
	updated_at: string
	employer_id_claim_request: string
}
