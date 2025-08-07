import fs from 'node:fs'
import csv from 'csv-parser'

/**
 * Must batch large imports together to avoid exceeding the maximum write limit of 500.
 */
export const getCSVContent = (csvFilePath: string) => {
	const data = []

	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on('data', (row) => {
			data.push(row)
		})
		.on('end', async () => {
			console.log(`CSV file successfully read. Found ${data.length} rows.`)
		})

	return data
}
