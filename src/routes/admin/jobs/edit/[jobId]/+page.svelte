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
	import { getHumanDateFromFirebaseTimestamp, getTwoWeeksFromNow, isJobExpired } from '$lib/date'
	import type { PageData } from './$types'
	import { cachedAdminData } from '$lib/cache.svelte'

	let { data }: { data: PageData } = $props()
	let job = $state<JobWithID>(data)

	// let job = $state({} as JobWithID | undefined)

	let isLoading = $state(false)
	let hasError = $state(false)
	let isSuccess = $state(false)
	let editFormStatus = $state<FormStatus>('IDLE')
	let renewStatus = $state<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE')

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

	const handleRenew = async (jobId: string) => {
		try {
			renewStatus = 'LOADING'
			const newExpiration = getTwoWeeksFromNow()
			const { status } = await updateJobById(jobId, {
				expiresAt: newExpiration
			})

			if (status === 'error') {
				throw new Error('Error renewing job')
			}

			job = {
				...job,
				expiresAt: newExpiration
			}

			renewStatus = 'SUCCESS'
		} catch (err) {
			renewStatus = 'ERROR'
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

<div class="prose prose-sm">
	<h1>Edit Job</h1>
	{#if isJobExpired(job.expiresAt)}
		<p>
			This job <strong>expired</strong> on {getHumanDateFromFirebaseTimestamp(job.expiresAt)}. Click
			<a href="#renew" onclick={() => handleRenew(job.id)}>here</a> to renew, or scroll down to the "Renew"
			section below to renew this job listing for another two weeks.
		</p>
	{:else}
		<p>
			Update details or renew your listing. This listing will expire on {getHumanDateFromFirebaseTimestamp(
				job.expiresAt
			)}
		</p>
	{/if}
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
	employer={cachedAdminData.employer ?? ({} as any)}
/>

<div class="mb-8 mt-12">
	<div class="prose prose-sm mb-4">
		<h2>Renew</h2>
		<p>
			Click submit to renew your listing below. This will reset the jobs expiration to two weeks
			from submission.
		</p>
		<p><strong>Current Expiration:</strong> {getHumanDateFromFirebaseTimestamp(job.expiresAt)}</p>
	</div>
	<div class="mb-4">
		{#if renewStatus === 'LOADING'}
			<Alert title="Renewing job..." type="secondary" />
		{/if}
		{#if renewStatus === 'ERROR'}
			<Alert title="Error renewing job, please try again" type="alert" />
		{/if}
		{#if renewStatus === 'SUCCESS'}
			<Alert title="Job renewed successfully" type="success" />
		{/if}
	</div>

	<div id="renew">
		<Button
			title="Renew"
			type="secondary"
			onclick={() => handleRenew(job.id)}
			isLoading={renewStatus === 'LOADING'}
			loadingText="Renewing..."
			disabled={renewStatus === 'LOADING'}
		/>
	</div>
</div>

<div class="prose prose-sm">
	<h2>Delete Job</h2>
	<p>This job will be permanently deleted and cannot be undone.</p>
	<Button onclick={() => handleDelete(job.id)} type="danger" {isLoading} title="Delete Job" />
</div>
