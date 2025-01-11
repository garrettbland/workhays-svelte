<script>
	import { authData } from '$lib/auth.svelte'
	import { page } from '$app/state'
	import { getJobById } from '$lib/jobs.admin'

	let isGettingJob = $state(getJobById(page.params.jobId, authData.user?.memberOf[0]))
</script>

{#await isGettingJob}
	<div>Loading...</div>
{:then job}
	<h1>Edit Job: {job.title}</h1>
{:catch error}
	<div>Error loading job</div>
{/await}
