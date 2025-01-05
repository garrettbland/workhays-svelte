import type { PageLoad } from './$types';

/**
 * TO DO: Cache the data here in the store just like we do on the home page
 */

export const load: PageLoad = async ({ params }) => {
	const raw = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.jobId}`);
	const data = await raw.json();

	console.log(data);

	const jobTitle = data.title;

	return {
		post: {
			title: jobTitle,
			content: `Content for ${params.jobId} goes here`
		}
	};
};
