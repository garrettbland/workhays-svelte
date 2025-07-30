<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import type { Job, JobInputs, FormStatus } from '$lib/types'
	import { INDUSTRIES, JOB_TYPES, JOB_STATUSES } from '$lib/constants'
	import RichText from '$lib/components/RichText.svelte'
	import Button from '$lib/components/Button.svelte'

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
		description: {
			type: 'doc',
			content: [{ type: 'paragraph', content: [] }]
		},
		employerTitle: '',
		employerId: '',
		type: '' as JOB_TYPES,
		applicationLink: '',
		status: JOB_STATUSES.Draft,
		industry: '' as INDUSTRIES,
		isDeleted: false,
		expiresAt: '' as any // This is set when the job is created. So I don't care about the type here
	}

	let isLoading = $state(false)
	let job = $state<JobInputs>(currentJob ? currentJob : DEFAULT_EMPTY_JOB)

	const clearInputs = () => (job = DEFAULT_EMPTY_JOB)

	const handleSubmitCallback = async () => {
		try {
			onStatusChange('IDLE')
			isLoading = true
			await handleSubmit({
				...job
				// description: editor.getJSON() // Saving directly as JSON to firebase
			})
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

<form onsubmit={handleSubmitCallback} class="space-y-8">
	<!-- Job Title -->
	<div>
		<label for="title" class="mb-2 block text-sm font-medium dark:text-white">Job Title</label>
		<input
			type="text"
			id="title"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="Sales Associate"
			aria-describedby="hs-input-helper-text"
			name="title"
			bind:value={job.title}
		/>
		<!-- <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500" id="hs-input-helper-text">
		Helper text
	</p> -->
	</div>

	<!-- Description -->
	<div>
		<RichText bind:value={job.description} placeholder="Enter job details" />
	</div>

	<!-- Industry -->
	<div>
		<label for="industry" class="mb-2 block text-sm font-medium dark:text-white">Industry</label>
		<select
			bind:value={job.industry}
			id="industry"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
		>
			<option value="" disabled selected>Please select an industry</option>
			{#each Object.entries(INDUSTRIES) as industry}
				<option value={industry[1]}>{industry[0]}</option>
			{/each}
		</select>
	</div>

	<!-- Type -->
	<div>
		<label for="type" class="mb-2 block text-sm font-medium dark:text-white">Position Type</label>
		<select
			bind:value={job.type}
			id="type"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
		>
			<option value="" disabled selected={job.type ? false : true}>Please select an type</option>
			{#each Object.entries(JOB_TYPES) as type}
				<option value={type[1]}>{type[0]}</option>
			{/each}
		</select>
	</div>

	<!-- Job Status -->
	<div>
		<label for="status" class="mb-2 block text-sm font-medium dark:text-white"
			>Status {job.status}</label
		>
		<select
			bind:value={job.status}
			id="status"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
		>
			<option value="" disabled>Please select an status</option>
			{#each Object.entries(JOB_STATUSES) as status}
				<option value={status[1]}>{status[0]}</option>
			{/each}
		</select>
	</div>

	<!-- Application Link -->
	<div>
		<label for="applicationLink" class="mb-2 block text-sm font-medium dark:text-white"
			>Application Link</label
		>
		<input
			type="url"
			id="applicationLink"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="Application Link"
			aria-describedby="hs-input-helper-text"
			name="applicationLink"
			bind:value={job.applicationLink}
		/>
	</div>

	<Button type="primary" {isLoading} title="Submit" />

	<!-- <button
		type="submit"
		class="focus:outline-hidden inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
	>
		{isLoading ? 'Loading...' : 'Submit'}
	</button> -->
</form>
