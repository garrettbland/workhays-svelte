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
	import Alert from '$lib/components/Alert.svelte'
	import Button from '$lib/components/Button.svelte'
	import { getHumanDateFromFirebaseTimestamp } from '$lib/date'

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
			const ok = window.confirm(
				'Are you sure you want to delete this job? This action cannot be undone.'
			)
			if (!ok) return
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
	<div class="prose prose-sm">
		<h1>Edit Job</h1>
		<p>
			Update details or renew your listing. This listing will expire on {getHumanDateFromFirebaseTimestamp(
				job.expiresAt
			)}
		</p>
	</div>

	<!-- TODO: Is there anything better than this? -->
	<div class="my-6">
		{#if editFormStatus === 'LOADING'}
			<Alert title="Loading..." type="secondary" />
		{/if}
		{#if editFormStatus === 'ERROR'}
			<Alert title="Error - Your job has not been updated, please try again" type="alert" />
		{/if}
		{#if editFormStatus === 'SUCCESSFUL'}
			<Alert title="Success - Your job has been updated" type="success" />
		{/if}
	</div>

	<JobForm
		currentJob={job}
		handleSubmit={(job) => handleSubmit(page.params.jobId, job)}
		onStatusChange={(status) => (editFormStatus = status)}
		clearInputsOnSubmit={false}
	/>

	<div class="prose prose-sm my-4">
		<h2>Renew</h2>
		<p>
			Click submit to renew your listing below. This will reset the jobs expiration to two weeks
			from submission.
		</p>
		<div>
			<Button title="Renew" type="secondary" onclick={() => console.log('renew')} />
		</div>
	</div>

	<div class="my-8 rounded-md border border-red-300 p-4">
		<h2 class="text font-bold">Delete Job</h2>
		<p class="text-sm">This job will be permanently deleted and cannot be undone.</p>
		<Button onclick={() => handleDelete(job.id)} type="danger" {isLoading} title="Delete Job" />
	</div>
{:catch error}
	<div>Error loading job</div>
{/await}
