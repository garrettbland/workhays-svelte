import fs from 'node:fs'
import csv from 'csv-parser'
import { auth } from './firestore.ts'
import { OldUser } from './types.ts'
import { Buffer } from 'node:buffer'

const CSV_FILE_PATH = './database/users-manual-export.csv'

/**
 * Must batch large imports together to avoid exceeding the maximum write limit of 500.
 */
export const importLargeCSVToAuth = () => {
	console.log(`Starting auth import`)

	const users: OldUser[] = []

	fs.createReadStream(CSV_FILE_PATH)
		.pipe(csv())
		.on('data', (row) => {
			users.push(row)
		})
		.on('end', async () => {
			console.log(`CSV file successfully read. Found ${users.length} rows.`)

			const updatedRecords: {
				uid: string
				email: string
				passwordHash: Buffer
			}[] = users.map((record) => ({
				uid: record.id,
				email: record.email,
				passwordHash: Buffer.from(record.password)
			}))

			try {
				/**
				 * Import users with our same 'uid' from postgres
				 */
				const result = await auth.importUsers(updatedRecords, {
					hash: {
						algorithm: 'BCRYPT'
					}
				})

				console.log(`Successfully imported ${result.successCount} users.`)
				console.log(`Failed to import ${result.failureCount} users.`)
				console.log(`Errors:`, result.errors) // Log any errors
			} catch (error) {
				console.error('Error importing users to auth:', error)
			}
		})
}

importLargeCSVToAuth()
