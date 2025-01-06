<script>
	import { getPublicJobs } from '$lib/jobs';
	import SEO from '$lib/components/SEO.svelte';
	import { dataStore } from '$lib/stores/dataStore';
	import { get } from 'svelte/store';

	import { onMount } from 'svelte';
	let jobs = [];
	let error = null;

	onMount(async () => {
		// Check if data already exists in the store
		console.log('Mounted...');
		if (!get(dataStore)) {
			console.log('Fetching fresh data from server...');
			try {
				// const response = await fetch('https://jsonplaceholder.typicode.com/posts');
				// if (!response.ok) {
				// 	throw new Error('Failed to fetch data');
				// }
				// data = await response.json();

				const data = await getPublicJobs();

				dataStore.set(data); // Cache the data
			} catch (err) {
				error = err.message;
			}
		}

		// Subscribe to the store
		dataStore.subscribe((value) => {
			jobs = value;
		});
	});
</script>

<SEO title="Work Hays" description="Blah blah blah" />

<h1>Current Job Openings</h1>

<p>Bunch of fake items from jsonplaceholder to test data fetching and preloading/etc...</p>
{#if error}
	<p>Error: {error}</p>
{:else if jobs.length === 0}
	<p>Loading...</p>
{:else}
	<ul>
		{#each jobs as job}
			<li><a href={`/jobs/${job._id}`}>{job.title}</a></li>
		{/each}
	</ul>
{/if}
