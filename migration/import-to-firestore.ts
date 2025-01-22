import fs from 'node:fs'
import csv from 'csv-parser'
import { firestore, Timestamp, serverTimestamp } from './firestore.ts'

/**
 * Must batch large imports together to avoid exceeding the maximum write limit of 500.
 */
export const importLargeCSVToFirestore = (
	csvFilePath: string,
	collectionName: string,
	dataMapper: (record) => Record<any, any>
) => {
	const MAX_BATCH_SIZE = 499
	const data = []

	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on('data', (row) => {
			data.push(row)
		})
		.on('end', async () => {
			console.log(`CSV file successfully read. Found ${data.length} rows.`)

			try {
				for (let i = 0; i < data.length; i += MAX_BATCH_SIZE) {
					const batch = firestore.batch()
					const chunk = data.slice(i, i + MAX_BATCH_SIZE)

					chunk.forEach((record) => {
						/**
						 * Map data to new format
						 */
						const updatedRecord = {
							...dataMapper(record),
							updatedAt: serverTimestamp(),
							createdAt: Timestamp.fromMillis(new Date(record.created_at).getTime())
						}

						const docRef = firestore.collection(collectionName).doc(record.id)
						batch.set(docRef, updatedRecord)
					})

					await batch.commit()
					console.log(`Batch ${i / MAX_BATCH_SIZE + 1} imported.`)
				}

				console.log('All data successfully imported.')
			} catch (error) {
				console.error('Error importing data:', error)
			}
		})
}
