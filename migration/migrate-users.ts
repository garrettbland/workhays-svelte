/**
 * Migrates local jobs from the old format to the new format
 * and inserts into firebase
 */
import { importLargeCSVToFirestore } from './import-to-firestore.ts'
import type { User } from '../src/lib/types.ts'
import { OldEmployer, OldUser } from './types.ts'
import { Timestamp } from 'firebase/firestore'
const CSV_PATH = './database/users-manual-export.csv'
const CSV_PATH_EMPLOYERS = './database/employers-manual-export.csv'
import { getCSVContent } from './getCSVContent.ts'

/**
 * SQL query to get users (only get verified to cut down on spam submissions)
 * SELECT * from users WHERE status = 'verified' LIMIT 10;
 */

let oldEmployers: OldEmployer[] = []

/**
 * Maps old data to new data
 */
export const userRecordDataMapper = (record: OldUser): Required<User> => {
	const memberOfEmployerId = oldEmployers.find((employer) => employer.user_id === record.id)?.id

	return {
		// id: string
		uid: record.id,
		firstName: record.first_name,
		lastName: record.last_name,
		email: record.email,
		memberOf: [memberOfEmployerId ?? ''], // todo: test this
		emailVerified: true, // assuming all users are verified in the old system
		emailVerificationCode: 'TRANSFERED_FROM_LEGACY', // not used in the new system
		// password: string
		// password_reset_token: string
		// password_reset_token_expires: string
		// status: 'pending' | 'verified' | 'locked'
		// role: 'USER' | 'MODERATOR' | 'ADMIN',
		role: record.role === 'admin' ? 'ADMIN' : record.role === 'moderator' ? 'MODERATOR' : 'USER',
		// last_login: string
		createdAt: Timestamp.fromDate(new Date(record.created_at)),
		updatedAt: Timestamp.fromDate(new Date(record.updated_at))
		// employer_id_claim_request: string
	}
}

const main = async () => {
	console.log('Starting Users Migration...')

	console.log('Getting Employers CSV content...')
	oldEmployers = await getCSVContent(CSV_PATH_EMPLOYERS)

	await importLargeCSVToFirestore(CSV_PATH, 'users', userRecordDataMapper)
	console.log('Users Migration complete.')
}

main()
