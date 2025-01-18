<script>
	import { authData } from '$lib/auth.svelte'
	import { getJobsByEmployerId } from '$lib/jobs.admin'

	/**
	 * Gets all public jobs. Takes advantage of "await" blocks from Svelte.
	 * https://svelte.dev/docs/svelte/await
	 */
	let isGettingJobs = $state(getJobsByEmployerId(authData.user?.memberOf[0] ?? ''))
</script>

<h1>Jobs</h1>

{#await isGettingJobs}
	<div>Loading jobs...</div>
{:then jobs}
	<ul>
		{#each jobs as job}
			<li><a href={`/admin/jobs/edit/${job.id}`}>{job.title}</a></li>
		{/each}
	</ul>
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong getting jobs: {error.message}</p>
{/await}

<a href="/admin/jobs/new">Create New Job</a>
