/**
 * Migrates local jobs from the old format to the new format
 * and inserts into firebase
 */
import { importLargeCSVToFirestore } from './import-to-firestore.ts'
import type { Employer } from '../src/lib/types.ts'
import { OldEmployer } from './types.ts'
import { generateJSON } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
const CSV_PATH = './database/employers-manual-export.csv'
import { Timestamp } from 'firebase/firestore'

/**
 * SQL query to get employers. Only gets employers that have a "verified" user
 * SELECT employers.*, users.status FROM employers JOIN users ON employers.user_id = users.id WHERE users.status = 'verified' LIMIT 10;
 */

/**
 * Maps old data to new data
 */
const dataMapper = (record: OldEmployer): Required<Employer> => {
	return {
		title: record.title,
		description: generateJSON(record.description, [StarterKit]), // convet to tiptap JSON
		users: [
			{
				userId: record.user_id,
				role: 'OWNER',
				status: 'ACCEPTED'
			}
		],
		status: 'APPROVED', // only migrating approved users
		contact: record.contact,
		email: record.email,
		phone: record.phone,
		logo_url: record.logo_url,
		// header_image_url: record.header_image_url,
		website_url: record.website_url,
		// facebook_url: record.facebook_url,
		// twitter_url: record.twitter_url,
		// instagram_url: record.instagram_url,
		// youtube_url: record.youtube_url,
		createdAt: Timestamp.fromDate(new Date(record.created_at)),
		updatedAt: Timestamp.fromDate(new Date(record.updated_at))
	}
}

const main = async () => {
	console.log('Starting Employers Migration...')
	await importLargeCSVToFirestore(CSV_PATH, 'employers', dataMapper)
	console.log('Employers Migration complete.')
}

main()
