/**
 * Migrates local jobs from the old format to the new format
 * and inserts into firebase
 */
import { importLargeCSVToFirestore } from './import-to-firestore'
import { OldJob, Job } from './types'

/**
 * Maps old job data to new job data
 */
const dataMapper = (record: OldJob): Job => {
	return {
		title: record.title,
		description: record.description,
		employerId: record.employer_id,
		employerTitle: record.employer_title,
		type: record.job_type,
		applicationLink: record.application_link,
		status: record.status,
		industry: record.industry,
		legacyId: record.id,
		renewedAt: record.renewed_at,
		createdAt: record.created_at,
		updatedAt: record.updated_at
	}
}

const main = async () => {
	const csvPath = 'path/to/old-jobs.csv'
	await importLargeCSVToFirestore(csvPath, 'jobs', dataMapper)
	console.log('Jobs Migration complete.')
}

main()
