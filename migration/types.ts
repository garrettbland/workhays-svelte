export interface OldJob {
	id: string
	title: string
	description: string
	employer_id: string
	job_type: 'full_time' | 'part_time'
	application_link: string
	status: 'active' | 'inactive' | 'archived'
	industry: string
	renewed_at: string
	created_at: string
	updated_at: string
}

export interface Job {
	title: string // title
	description: string // description
	employerTitle: string // **new**
	employerId: string // employer_id
	type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN' // job_type (full_time, part_time)
	applicationLink: string // application_link
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' // status (active, inactive, archived)
	industry: string // industry
	legacyId: string // id (legacy, left over from postgres days, needed?)
	renewedAt: string // renewed_at
	createdAt: string // created_at
	updatedAt: string // updated_at
}
