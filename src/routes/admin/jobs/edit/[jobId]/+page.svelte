<script lang="ts">
	/**
	 * To Do: Fix a lot of this page and the loading indicator stuff, it's a mess
	 * along with the error and success handling. (updating job by id is also wonky)
	 */

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
			editFormStatus = 'LOADING'
			const { status } = await updateJobById(jobId, updatedFields)
			if (status !== 'success') {
				editFormStatus = 'ERROR'
			}
			throw new Error('Job not updated')
		} catch (err) {
			console.log(err)
			editFormStatus = 'ERROR'
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
	{editFormStatus}
	<h1>Edit Job: {job.title}</h1>

	{#if editFormStatus === 'ERROR'}
		Error updating job
	{/if}
	{#if editFormStatus === 'SUCCESSFUL'}
		<p class="text-5xl">Successful job update</p>
	{/if}

	<JobForm
		currentJob={job}
		handleSubmit={(job) => handleSubmit(page.params.jobId, job)}
		onStatusChange={(status) => (editFormStatus = status)}
		clearInputsOnSubmit={false}
	/>

	<button on:click={() => handleDelete(job.id)}>Delete Job</button>
{:catch error}
	<div>Error loading job</div>
{/await}
