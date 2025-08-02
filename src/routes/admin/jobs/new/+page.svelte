<script lang="ts">
	import { authData } from '$lib/auth.svelte'
	import { createJob } from '$lib/jobs.admin'
	import type { EmployerWithID, Job, FormStatus } from '$lib/types'
	import { getEmployerById } from '$lib/employer.admin'
	import { INDUSTRIES, JOB_TYPES, JOB_STATUSES } from '$lib/constants'
	import JobForm from '$lib/components/JobForm.svelte'
	import { goto } from '$app/navigation'
	import Alert from '$lib/components/Alert.svelte'
	// import { cachedAdminData } from '$lib/cache.svelte'

	type JobInputs = Omit<Job, 'createdAt' | 'updatedAt' | 'expiresAt'>
	const DEFAULT_EMPTY_JOB: JobInputs = {
		title: '',
		description: {},
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

	let newFormStatus = $state<FormStatus>('IDLE')

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
			goto(`/admin/jobs?newJobId=${newJobId}`)
		} catch (err) {
			hasError = true
			console.error(err)
		} finally {
			isLoading = false
		}
	}
</script>

<div class="prose prose-sm mb-8">
	<h1>New Job</h1>
</div>

{#if newFormStatus === 'ERROR'}
	<Alert type="warning" title="Error creating job. Please try again." />
{/if}

{#await currentEmployer}
	<div>loading...</div>
{:then employer}
	<JobForm
		handleSubmit={(_job) => handleSubmit(_job, employer)}
		onStatusChange={(status) => (newFormStatus = status)}
		clearInputsOnSubmit={true}
		{employer}
	/>
	<!-- <form on:submit|preventDefault={() => handleSubmit(job, employer)}>
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
	</form> -->
{:catch err}
	<div>error loading employer...</div>
{/await}
