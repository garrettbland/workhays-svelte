<script lang="ts">
	import { authData } from '$lib/auth.svelte'
	import { page } from '$app/state'
	import { getJobById, updateJobById } from '$lib/jobs.admin'
	import type { Job, JobWithID } from '$lib/types'

	let currentJob = $state(getJobById(page.params.jobId, authData.user?.memberOf[0]))
	let isLoading = $state(false)
	let hasError = $state(false)
	let isSuccess = $state(false)

	const handleSubmit = async (jobId: string, updatedFields: Partial<Job>) => {
		try {
			isLoading = true
			hasError = false
			isSuccess = false
			await updateJobById(jobId, updatedFields)
			isSuccess = true
		} catch (err) {
			hasError = true
		} finally {
			isLoading = false
		}
	}
</script>

{#await currentJob}
	<div>Loading...</div>
{:then job}
	<h1>Edit Job: {job.title}</h1>
	{#if isLoading}
		Updating job...
	{/if}
	{#if hasError}
		Error updating job
	{/if}
	{#if isSuccess}
		Successful job update
	{/if}
	<form on:submit|preventDefault={() => handleSubmit(job.id, job)}>
		<label for="title">Title</label>
		<input bind:value={job.title} type="text" id="title" name="title" required />

		<label for="description">Description</label>
		<textarea bind:value={job.description} id="description" name="description" required></textarea>

		<button type="submit">{isLoading ? 'Loading...' : 'Submit'}</button>
	</form>
{:catch error}
	<div>Error loading job</div>
{/await}
