/**
 * Checks for expired jobs, marks them as expired, and send notification emails
 * to the employer. This job is ran via scheduled function from vercel, and is
 * not publically accessible.
 *
 * To test this locally, run: npx netlify dev, and then open localhost:8888/.netlify/functions/check-job-expiration
 */

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
	console.log('Scheduled function running at', new Date().toISOString())
}
