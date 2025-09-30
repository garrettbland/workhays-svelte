<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import type { Job, JobInputs, FormStatus, Employer, EmployerWithID } from '$lib/types'
	import { INDUSTRIES, JOB_TYPES, JOB_STATUSES } from '$lib/constants'
	import RichText from '$lib/components/RichText.svelte'
	import Button from '$lib/components/Button.svelte'
	import { createForm } from 'felte'
	import * as zod from 'zod'
	import type { JSONContent } from '@tiptap/core'
	import { validator } from '@felte/validator-zod'

	// let status = $state<'IDLE' | 'LOADING' | 'SUCCESSFUL' | 'ERROR'>('IDLE')

	const schema = zod.object({
		title: zod.string().nonempty(),
		description: zod.custom<JSONContent>((val) => {
			if (typeof val === 'object' && val !== null) {
				return true
			}
			return false
		}, 'Description must be a valid JSON object'),
		industry: zod.string().nonempty(),
		type: zod.string().nonempty(),
		status: zod.string().optional(),
		applicationLink: zod
			.string()
			.optional()
			.refine((val) => !val || /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w- ./?%&=]*)?$/.test(val), {
				message: 'Invalid URL'
			})
	})

	let {
		currentJob,
		handleSubmit,
		onStatusChange,
		clearInputsOnSubmit,
		employer
	}: {
		currentJob?: Job
		handleSubmit: (
			job: Omit<Job, 'updatedAt' | 'createdAt' | 'expiresAt' | 'sortId' | 'isDeleted'>
		) => Promise<void>
		onStatusChange: (status: FormStatus) => void
		clearInputsOnSubmit: boolean
		employer: EmployerWithID
	} = $props()

	let formErrorMessage = $state<string | null>(null)
	let jobDescription = $state<JSONContent>(
		currentJob?.description ?? { type: 'doc', content: [{ type: 'paragraph', content: [] }] }
	)

	const { form, errors, warnings, isValid, setErrors, isSubmitting, setFields, data } = createForm({
		extend: validator({ schema }),
		initialValues: {
			title: currentJob ? currentJob.title : '',
			description: currentJob?.description
				? (currentJob.description as JSONContent)
				: {
						type: 'doc',
						content: [{ type: 'paragraph', content: [] }]
					},
			industry: currentJob ? currentJob.industry : ('' as INDUSTRIES),
			type: currentJob ? currentJob.type : ('' as JOB_TYPES),
			status: currentJob ? currentJob.status : JOB_STATUSES.Draft,
			applicationLink: currentJob ? currentJob.applicationLink : undefined
		},
		onSubmit: async (values, context) => {
			try {
				formErrorMessage = null

				await handleSubmit({
					...values,
					employerId: employer.id,
					employerTitle: employer.title
				})

				// const { status, employerId } = await createEmployer(
				// 	{
				// 		title: values.title,
				// 		description: values.description, // Assuming description is a rich text field
				// 		contact: values.contact,
				// 		email: values.email,
				// 		phone: values.phone,
				// 		website_url: values.website_url
				// 	},
				// 	userId
				// )

				// if (status !== 'SUCCESS' || !employerId) {
				// 	formErrorMessage = 'There was an issue creating a new employer. Please try again.'
				// 	return
				// }

				// clearCachedData()
			} catch (err) {
				formErrorMessage = 'Something went wrong while submitting the form. Please try again.'
			}
		}
		// preventDefault: true
		// onSuccess(response, context) {
		// 	context.reset()
		// 	onSuccess(response.newUser.uid) // Assuming the response contains the new user ID
		// }
	})

	$effect(() => {
		setFields('description', jobDescription)
	})

	// const DEFAULT_EMPTY_JOB: JobInputs = {
	// 	title: '',
	// 	description: {
	// 		type: 'doc',
	// 		content: [{ type: 'paragraph', content: [] }]
	// 	},
	// 	employerTitle: '',
	// 	employerId: '',
	// 	type: '' as JOB_TYPES,
	// 	applicationLink: '',
	// 	status: JOB_STATUSES.Draft,
	// 	industry: '' as INDUSTRIES,
	// 	isDeleted: false,
	// 	expiresAt: '' as any // This is set when the job is created. So I don't care about the type here
	// }

	// let isLoading = $state(false)
	// let job = $state<JobInputs>(currentJob ? { ...currentJob } : DEFAULT_EMPTY_JOB)

	// const clearInputs = () => (job = DEFAULT_EMPTY_JOB)

	// const handleSubmitCallback = async () => {
	// 	try {
	// 		onStatusChange('IDLE')
	// 		isLoading = true
	// 		await handleSubmit({
	// 			...job
	// 			// description: editor.getJSON() // Saving directly as JSON to firebase
	// 		})
	// 		clearInputsOnSubmit && clearInputs()
	// 		onStatusChange('SUCCESSFUL')
	// 	} catch (err) {
	// 		console.error(`Error submitting form`, err)
	// 		onStatusChange('ERROR')
	// 	} finally {
	// 		isLoading = false
	// 	}
	// }
</script>

<form use:form class="space-y-8">
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
		/>
		<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
			{#if $errors.title}
				{$errors.title}
			{/if}
		</p>
	</div>

	<!-- Description -->
	<div>
		<RichText bind:value={jobDescription} placeholder="Enter job details" />
		<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
			{#if $errors.description}
				Employer description is required. A few sentences about the employer is a good start.
			{/if}
		</p>
	</div>

	<!-- Industry -->
	<div>
		<label for="industry" class="mb-2 block text-sm font-medium dark:text-white">Industry</label>
		<select
			id="industry"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			name="industry"
		>
			<option value="" disabled selected>Please select an industry</option>
			{#each Object.entries(INDUSTRIES) as industry}
				<option value={industry[1]}>{industry[0]}</option>
			{/each}
		</select>
		<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
			{#if $errors.industry}
				{$errors.industry}
			{/if}
		</p>
	</div>

	<!-- Position Type -->
	<div>
		<label for="type" class="mb-2 block text-sm font-medium dark:text-white">Position Type</label>
		<select
			name="type"
			id="type"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
		>
			<option value="" disabled selected={$data.type ? false : true}>Please select an type</option>
			{#each Object.entries(JOB_TYPES) as type}
				<option value={type[1]}>{type[0]}</option>
			{/each}
		</select>
		<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
			{#if $errors.type}
				{$errors.type}
			{/if}
		</p>
	</div>

	<!-- Job Status -->
	<div>
		<label for="status" class="mb-2 block text-sm font-medium dark:text-white">Status</label>
		{#if employer.status === 'PENDING'}
			<p class="mb-2 text-sm text-red-600 dark:text-neutral-500">
				Your employer is still pending approval. You can still create jobs, but cannot be published
				until your employer is approved.
			</p>
		{/if}
		<select
			disabled={employer.status === 'PENDING'}
			name="status"
			id="status"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
		>
			<option value="" disabled>Please select an status</option>
			{#each Object.entries(JOB_STATUSES) as status}
				<option value={status[1]}>{status[0]}</option>
			{/each}
		</select>
		<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
			{#if $errors.status}
				{$errors.status}
			{/if}
		</p>
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
		/>
		<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
			{#if $errors.applicationLink}
				{$errors.applicationLink}
			{/if}
		</p>
	</div>

	<Button type="primary" title="Submit" isLoading={$isSubmitting} />
</form>
