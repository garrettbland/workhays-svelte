/**
 * Checks for expired jobs, marks them as expired, and send notification emails
 * to the employer. This job is ran via scheduled function from vercel, and is
 * not publically accessible.
 *
 * To test this locally, run: npx tsx scripts/test-check-job-expiration.ts
 */
export async function GET(request: Request) {
	return Response.json({ test: 'it works', time: new Date().toISOString() })
}
