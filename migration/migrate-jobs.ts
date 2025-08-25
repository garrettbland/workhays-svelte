/**
 * Migrates local jobs from the old format to the new format
 * and inserts into firebase
 */
import { importLargeCSVToFirestore } from './import-to-firestore.ts'
import type { Job } from '../src/lib/types.ts'
import { OldJobWithEmployerTitle } from './types.ts'
import { generateJSON } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
const CSV_PATH = './database/jobs-manual-export.csv'
import { Timestamp } from 'firebase/firestore'
import { getTwoWeeksFromNow } from '../src/lib/date.ts'

/**
 * SQL query to get jobs and add employer title
 * SELECT jobs.*, employers.title AS employer_title from jobs LEFT JOIN `employers` ON jobs.employer_id = employers.id;
 */

/**
 * Maps old job data to new job data
 */
const dataMapper = (record: OldJobWithEmployerTitle): Job => {
	return {
		title: record.title,
		description: generateJSON(record.description, [StarterKit]), // convert to tiptap JSON
		employerId: record.employer_id,
		employerTitle: record.employer_title,
		type: record.job_type === 'full_time' ? 'FULL_TIME' : 'PART_TIME',
		applicationLink: record.application_link,
		status: record.status === 'active' ? 'PUBLISHED' : 'DRAFT', // we only support PUBLISHED and DRAFT now
		industry: record.industry ?? 'uncategorized',
		isDeleted: false, // soft deletes were not a thing in legacy
		expiresAt: getTwoWeeksFromNow(new Date(record.renewed)), // to do: test that this works correctly
		createdAt: Timestamp.fromDate(new Date(record.created_at)),
		updatedAt: Timestamp.fromDate(new Date(record.updated_at)),
		sortId: Math.floor(Math.random() * 1_000_000) // random int for sorting jobs in random order
	}
}

const main = async () => {
	console.log('Starting Jobs Migration...')
	await importLargeCSVToFirestore(CSV_PATH, 'jobs', dataMapper)
	console.log('Jobs Migration complete.')
}

main()
