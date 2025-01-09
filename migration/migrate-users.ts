/**
 * Migrates local jobs from the old format to the new format
 * and inserts into firebase
 */
import { importLargeCSVToFirestore } from './import-to-firestore.ts'
import type { User } from '../src/lib/types.ts'
import { OldUser } from './types.ts'

const CSV_PATH = './database/users-manual-export.csv'

/**
 * SQL query to get users
 *
 */

/**
 * Maps old data to new data
 */
export const userRecordDataMapper = (record: OldUser): Required<User> => {
	return {
		// id: string
		uid: record.id,
		firstName: record.first_name,
		lastName: record.last_name,
		email: record.email,
		// password: string
		// password_reset_token: string
		// password_reset_token_expires: string
		// status: 'pending' | 'verified' | 'locked'
		// role: 'USER' | 'MODERATOR' | 'ADMIN',
		role: record.role === 'employer' ? 'USER' : record.role === 'moderator' ? 'MODERATOR' : 'ADMIN',
		// last_login: string
		createdAt: record.created_at,
		updatedAt: record.updated_at
		// employer_id_claim_request: string
	}
}

const main = async () => {
	console.log('Starting Users Migration...')
	await importLargeCSVToFirestore(CSV_PATH, 'users', userRecordDataMapper)
	console.log('Users Migration complete.')
}

main()
