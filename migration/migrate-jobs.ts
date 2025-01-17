/**
 * Migrates local jobs from the old format to the new format
 * and inserts into firebase
 */
import { importLargeCSVToFirestore } from './import-to-firestore.ts'
import type { Job } from '../src/lib/types.ts'
import { OldJobWithEmployerTitle } from './types.ts'

const CSV_PATH = './database/jobs-manual-export.csv'

/**
 * SQL query to get jobs and add employer title
 * SELECT jobs.*, employers.title AS employer_title from jobs LEFT JOIN `employers` ON jobs.employer_id = employers.id;
 */

/**
 * Maps old job data to new job data
 */
const dataMapper = (record: OldJobWithEmployerTitle): Required<Job> => {
	return {
		title: record.title,
		description: record.description,
		employerId: record.employer_id,
		employerTitle: record.employer_title,
		type: record.job_type === 'full_time' ? 'FULL_TIME' : 'PART_TIME',
		applicationLink: record.application_link,
		status:
			record.status === 'active'
				? 'PUBLISHED'
				: record.status === 'inactive'
					? 'DRAFT'
					: 'ARCHIVED',
		industry: record.industry ?? 'uncategorized',
		isDeleted: false,
		createdAt: record.created_at,
		updatedAt: record.updated_at
	}
}

const main = async () => {
	console.log('Starting Jobs Migration...')
	await importLargeCSVToFirestore(CSV_PATH, 'jobs', dataMapper)
	console.log('Jobs Migration complete.')
}

main()
