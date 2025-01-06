import type { PageLoad } from './$types';
import { dataStore } from '$lib/stores/dataStore';
import { get } from 'svelte/store';

export const load: PageLoad = async ({ params }) => {
	let jobTitle;

	const cachedData = get(dataStore); // Get the current value of the store
	if (cachedData) {
		console.log('DataStore has data');
		const job = cachedData.find((job) => job.id === params.jobId);
		if (job) {
			console.log('Job found in cache');
			jobTitle = job.title;
		}
	} else {
		console.log('Fetching fresh data...');
		const raw = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.jobId}`);
		const data = await raw.json();
		//dataStore.set(data);
		jobTitle = data.title;
	}

	return {
		post: {
			title: jobTitle,
			content: `Content for ${params.jobId} goes here`
		}
	};
};
