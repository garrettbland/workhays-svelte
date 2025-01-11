<script lang="ts">
	import { createJob } from '$lib/jobs.admin'
	import type { Job } from '$lib/types'

	let isLoading = $state(false)
	let hasError = $state(false)
	let newJob = $state<Job>()
	let isSuccess = $derived(newJob && Object.keys(newJob).length > 0)

	let title = $state('')
	let description = $state('')

	const clearInputs = () => {
		title = ''
		description = ''
	}

	const handleSubmit = async () => {
		try {
			isLoading = true
			hasError = false
			await createJob()
			alert('new job created')
			newJob = { title, description }
			clearInputs()
		} catch (err) {
			hasError = true
			console.error(err)
		} finally {
			isLoading = false
		}
	}
</script>

<h1>Create new job</h1>

{#if isSuccess}
	<p>Job created successfully. Job {newJob.title}</p>
{/if}

{#if hasError}
	<p class="text-red-500">There was an error creating the job. Please try again.</p>
{/if}

<form on:submit|preventDefault={handleSubmit}>
	<label for="title">Title</label>
	<input bind:value={title} type="text" id="title" name="title" required />

	<label for="description">Description</label>
	<textarea bind:value={description} id="description" name="description" required></textarea>

	<button type="submit">{isLoading ? 'Loading...' : 'Submit'}</button>
</form>
