import type { PageLoad } from './$types'
import { getPublicJob } from '$lib/jobs'
import { error } from '@sveltejs/kit'
import type { Job } from '$lib/types'

/**
 * Loads the job data on the server side initially, then
 * subsequent requests are done client side.
 *
 * This will make SEO happy so it can render job pages in a
 * traditional SSR way, but for humans jumping around jobs it
 * will be SPA and snappy.
 */
export const load: PageLoad = async ({ params }): Promise<Job> => {
	try {
		const job = await getPublicJob(params.jobId)
		return job
	} catch (err) {
		error(404, 'Not found')
	}
}
