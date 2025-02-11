<script lang="ts">
	import type { Job, JobInputs, FormStatus } from '$lib/types'
	import { INDUSTRIES, JOB_TYPES, JOB_STATUSES } from '$lib/constants'
	let {
		currentJob,
		handleSubmit,
		onStatusChange,
		clearInputsOnSubmit
	}: {
		currentJob?: Job
		handleSubmit: (job: JobInputs) => Promise<void>
		onStatusChange: (status: FormStatus) => void
		clearInputsOnSubmit: boolean
	} = $props()

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

	let isLoading = $state(false)
	let job = $state<JobInputs>(DEFAULT_EMPTY_JOB)

	$effect(() => {
		if (currentJob) {
			job = { ...currentJob }
		}
	})

	const clearInputs = () => (job = DEFAULT_EMPTY_JOB)

	const handleSubmitCallback = async () => {
		try {
			onStatusChange('IDLE')
			isLoading = true
			await handleSubmit(job)
			clearInputsOnSubmit && clearInputs()
			onStatusChange('SUCCESSFUL')
		} catch (err) {
			console.error(`Error submitting form`, err)
			onStatusChange('ERROR')
		} finally {
			isLoading = false
		}
	}
</script>

<form onsubmit={handleSubmitCallback}>
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
