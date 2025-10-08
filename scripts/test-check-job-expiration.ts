/**
 * This file is just used to test the vercel cron function locally
 * To run this file, use: npx tsx scripts/test-check-job-expiration.ts
 */

import { GET } from '../api/check-job-expiration'

console.log('Testing vercel api cron function...')

const test = async () => {
	const result = await GET()
	const data = await result.json()
	console.log('Result:', data)
}

test()
