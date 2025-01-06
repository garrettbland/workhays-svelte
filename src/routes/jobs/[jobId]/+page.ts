import type { PageLoad } from './$types';
import { cachedData } from '$lib/cache.svelte';
import { getPublicJob } from '$lib/jobs';

export const load: PageLoad = async ({ params }) => {
	let jobTitle;

	if (cachedData.jobs.length > 0) {
		console.log('DataStore has data');
		const job = cachedData.jobs.find((job) => job._id === params.jobId);
		if (job) {
			console.log('Job found in cache');
			jobTitle = job.title;
		}
	} else {
		console.log('Fetching fresh data...');
		const data = await getPublicJob(params.jobId);
		jobTitle = data.title;
	}

	return {
		post: {
			title: jobTitle,
			content: `Content for ${params.jobId} goes here`
		}
	};
};
