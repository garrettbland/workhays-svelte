<script lang="ts">
	import { authData } from '$lib/auth.svelte'
	import { page } from '$app/state'
	import { getJobById, updateJobById, softDeleteJobById } from '$lib/jobs.admin'
	import type { Job, JobWithID, FormStatus } from '$lib/types'
	import { INDUSTRIES, JOB_TYPES, JOB_STATUSES } from '$lib/constants'
	import { goto } from '$app/navigation'
	import JobForm from '$lib/components/JobForm.svelte'

	let currentJob = $state(getJobById(page.params.jobId, authData.user?.memberOf[0]))
	let isLoading = $state(false)
	let hasError = $state(false)
	let isSuccess = $state(false)
	let editFormStatus = $state<FormStatus>('IDLE')

	// $inspect(currentJob)

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

	const handleDelete = async (jobId: string) => {
		try {
			isLoading = true
			hasError = false
			isSuccess = false
			await softDeleteJobById(jobId)
			goto(`/admin/jobs?jobDeleted=true`)
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
	<!-- {#if isLoading}
		Updating job...
	{/if} -->
	{#if editFormStatus === 'ERROR'}
		Error updating job
	{/if}
	{#if editFormStatus === 'SUCCESSFUL'}
		<p class="text-5xl">Successful job update</p>
	{/if}

	<JobForm
		currentJob={job}
		handleSubmit={(job) => handleSubmit(page.params.jobId, job)}
		onStatusChange={(status) => editFormStatus === status}
		clearInputsOnSubmit={false}
	/>

	<!-- 
	<form on:submit|preventDefault={() => handleSubmit(job.id, job)}>
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

	<button on:click={() => handleDelete(job.id)}>Delete Job</button>
{:catch error}
	<div>Error loading job</div>
{/await}
