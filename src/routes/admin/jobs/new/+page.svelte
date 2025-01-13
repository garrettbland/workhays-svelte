<script lang="ts">
	import { authData } from '$lib/auth.svelte'
	import { createJob } from '$lib/jobs.admin'
	import type { EmployerWithID, Job } from '$lib/types'
	import { getEmployerById } from '$lib/employer.admin'

	/**
	 * TO DO: Set this up in cache
	 */
	let currentEmployer = $state(getEmployerById(authData.user?.memberOf[0] ?? ''))

	let isLoading = $state(false)
	let hasError = $state(false)
	let isSuccess = $state(false)

	/**
	 * TO DO: Complete the rest of the type and remove Partial
	 */
	let job = $state<Partial<Job>>({
		title: '',
		description: ''
	})
	let newJobId = $state()
	// let isSuccess = $derived(newJob && newJob.id)

	const clearInputs = () => {
		job.title = ''
		job.description = ''
	}

	const handleSubmit = async (jobData: Partial<Job>, employer: EmployerWithID) => {
		try {
			isLoading = true
			hasError = false
			isSuccess = false
			const newlyCreatedJob = await createJob(jobData as Job, employer.id, employer.title)
			isSuccess = true
			newJobId = newlyCreatedJob.id
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
	<p>Job created successfully. Job ID: {newJobId}</p>
{/if}

{#if hasError}
	<p class="text-red-500">There was an error creating the job. Please try again.</p>
{/if}

{#await currentEmployer}
	<div>loading...</div>
{:then employer}
	<form on:submit|preventDefault={() => handleSubmit(job, employer)}>
		<div>Employer: {employer.title}</div>

		<label for="title">Title</label>
		<input bind:value={job.title} type="text" id="title" name="title" required />

		<label for="description">Description</label>
		<textarea bind:value={job.description} id="description" name="description" required></textarea>

		<button type="submit">{isLoading ? 'Loading...' : 'Submit'}</button>
	</form>
{:catch err}
	<div>error loading employer...</div>
{/await}
