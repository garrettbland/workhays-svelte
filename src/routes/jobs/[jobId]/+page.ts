import type { PageLoad } from './$types';
import { getPublicJob } from '$lib/jobs';
import { error } from '@sveltejs/kit';

/**
 * Loads the job data on the server side initially, then
 * subsequent requests are done client side.
 *
 * This will make SEO happy so it can render job pages in a
 * traditional SSR way, but for humans jumping around jobs it
 * will be SPA and snappy.
 */
export const load: PageLoad = async ({ params }) => {
	try {
		const job = await getPublicJob(params.jobId);
		return {
			post: {
				title: job.title,
				content: `Content for ${params.jobId} goes here`
			}
		};
	} catch (err) {
		error(404, 'Not found');
	}
};
