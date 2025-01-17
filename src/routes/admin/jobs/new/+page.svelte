<script lang="ts">
	import { authData } from '$lib/auth.svelte'
	import { createJob } from '$lib/jobs.admin'
	import type { EmployerWithID, Job } from '$lib/types'
	import { getEmployerById } from '$lib/employer.admin'
	import { INDUSTRIES, JOB_TYPES, JOB_STATUSES } from '$lib/constants'

	type JobInputs = Omit<Job, 'createdAt' | 'updatedAt'>
	const DEFAULT_EMPTY_JOB: JobInputs = {
		title: '',
		description: '',
		employerTitle: '',
		employerId: '',
		type: '' as JOB_TYPES,
		applicationLink: '',
		status: JOB_STATUSES.Draft,
		industry: '' as INDUSTRIES,
		isDeleted: false
	}

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
	let job = $state<JobInputs>(DEFAULT_EMPTY_JOB)
	let newJobId = $state()
	// let isSuccess = $derived(newJob && newJob.id)

	const clearInputs = () => (job = DEFAULT_EMPTY_JOB)

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

		<label> industry </label>
		<select bind:value={job.industry}>
			<option value="" disabled selected>Please select an industry</option>
			{#each Object.entries(INDUSTRIES) as industry}
				<option value={industry[1]}>{industry[0]}</option>
			{/each}
		</select>

		<label> job type </label>
		<select bind:value={job.type}>
			<option value="" disabled selected>Please select an type</option>
			{#each Object.entries(JOB_TYPES) as type}
				<option value={type[1]}>{type[0]}</option>
			{/each}
		</select>

		<label> job status </label>
		<select bind:value={job.status}>
			<option value="" disabled selected>Please select an status</option>
			{#each Object.entries(JOB_STATUSES) as status}
				<option value={status[1]}>{status[0]}</option>
			{/each}
		</select>

		<label for="applicationLink">Job Application Link</label>
		<input
			bind:value={job.applicationLink}
			type="text"
			id="applicationLink"
			name="applicationLink"
			required
		/>

		<button type="submit">{isLoading ? 'Loading...' : 'Submit'}</button>
	</form>
{:catch err}
	<div>error loading employer...</div>
{/await}
