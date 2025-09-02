<script lang="ts">
	import { authData } from '$lib/auth.svelte'
	import Loader from '$lib/components/Loader.svelte'
	import { getEmployerById, updateEmployerById } from '$lib/employer.admin'
	import type { Employer, EmployerWithID } from '$lib/types'
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import * as zod from 'zod'
	import Button from '$lib/components/Button.svelte'
	import Alert from '$lib/components/Alert.svelte'
	import type { User } from '$lib/types'
	import { createEmployer } from '$lib/employer.admin'
	import type { JSONContent } from '@tiptap/core'
	import RichText from '$lib/components/RichText.svelte'
	import { updateUserById } from '$lib/users.admin'
	import { cachedAdminData, clearCachedData } from '$lib/cache.svelte'
	import { goto } from '$app/navigation'

	let currentEmployer = cachedAdminData.employer as EmployerWithID
	let hasSetInitialFields = $state(false)
	let formStatus = $state<'IDLE' | 'LOADING' | 'SUCCESSFUL' | 'ERROR'>('IDLE')

	let isLoading = $state(false)
	let hasError = $state(false)
	let isSuccess = $state(false)

	// const handleSubmit = async (employerId: string, updatedFields: Partial<EmployerWithID>) => {
	// 	console.log({ currentEmployer, updatedFields })

	// 	try {
	// 		isLoading = true
	// 		hasError = false
	// 		isSuccess = false
	// 		await updateEmployerById(employerId, updatedFields)
	// 		isSuccess = true
	// 	} catch (err) {
	// 		hasError = true
	// 	} finally {
	// 		isLoading = false
	// 	}
	// }

	let formErrorMessage = $state<string | null>(null)
	let employerDescription = $state<JSONContent>(currentEmployer.description)

	const schema = zod.object({
		title: zod.string().nonempty(),
		description: zod.custom<JSONContent>((val) => {
			if (typeof val === 'object' && val !== null) {
				return true
			}
			return false
		}, 'Description must be a valid JSON object'),
		contact: zod.string().nonempty(),
		email: zod.string().email().nonempty(),
		phone: zod
			.string()
			.optional()
			.refine((val) => !val || /^\(?([0-9]{3})\)?[-.● ]?([0-9]{3})[-.● ]?([0-9]{4})$/.test(val), {
				message: 'Invalid phone number'
			}),
		website_url: zod
			.string()
			.optional()
			.refine((val) => !val || /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w- ./?%&=]*)?$/.test(val), {
				message: 'Invalid URL'
			})
	})

	const { form, errors, warnings, isValid, setErrors, isSubmitting, setFields } = createForm({
		extend: validator({ schema }),
		initialValues: {
			title: currentEmployer.title,
			description: {} as JSONContent,
			contact: currentEmployer.contact,
			email: currentEmployer.email,
			phone: currentEmployer.phone ?? '',
			website_url: currentEmployer.website_url ?? ''
		},
		onSubmit: async (values, context) => {
			try {
				formErrorMessage = null
				formStatus = 'LOADING'

				const { status } = await updateEmployerById(currentEmployer, {
					title: values.title,
					description: values.description, // Assuming description is a rich text field
					contact: values.contact,
					email: values.email,
					phone: values.phone,
					website_url: values.website_url
				})

				window.scrollTo(0, 0)

				if (status === 'ERROR') {
					formStatus = 'ERROR'
					formErrorMessage = 'There was an issue updating your employer. Please try again.'
					return
				}

				formStatus = 'SUCCESSFUL'

				clearCachedData()
			} catch (err) {
				window.scrollTo(0, 0)
				formStatus = 'ERROR'
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
		setFields('description', employerDescription)
	})
</script>

{#if !currentEmployer}
	<Loader />
{/if}

{#if currentEmployer !== undefined}
	<div class="prose prose-sm mb-4">
		<h1>Employer Settings</h1>
	</div>

	<!-- <div class="mb-4">
		{#if isLoading}
			<Alert type="secondary" title="Loading..." />
		{/if}
		{#if hasError}
			<Alert
				type="warning"
				title="Error - Your changes has been not been saved, please try again"
			/>
		{/if}
		{#if isSuccess}
			<Alert type="success" title="Success - Your settings has been saved." />
		{/if}
	</div> -->

	{#if formStatus !== 'IDLE'}
		<div class="mb-8">
			{#if formStatus === 'SUCCESSFUL'}
				<Alert type="success" title="Success - Your settings has been saved." />
			{/if}

			{#if formStatus === 'ERROR'}
				<Alert
					type="warning"
					title={formErrorMessage ?? 'There has been an error, please try again'}
				/>
			{/if}
		</div>
	{/if}

	<form use:form class="space-y-8">
		<div>
			<label for="title" class="mb-2 block text-sm font-medium dark:text-white"
				>Employer Title</label
			>
			<input
				type="text"
				id="title"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				placeholder="Bobs Bakery"
				aria-describedby="hs-input-helper-text"
				name="title"
			/>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.title}
					{$errors.title}
				{/if}
			</p>
		</div>

		<div>
			<label for="description" class="mb-2 block text-sm font-medium dark:text-white"
				>Employer Description</label
			>

			<RichText
				bind:value={employerDescription}
				placeholder="Enter some info about this employer."
			/>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.description}
					Employer description is required. A few sentences about the employer is a good start.
				{/if}
			</p>
		</div>

		<div>
			<label for="contact" class="mb-2 block text-sm font-medium dark:text-white"
				>Contact Person</label
			>
			<input
				type="text"
				id="contact"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				placeholder="First Last, HR Manager, etc"
				aria-describedby="hs-input-helper-text"
				name="contact"
			/>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.contact}
					{$errors.contact}
				{/if}
			</p>
		</div>

		<div>
			<label for="email" class="mb-2 block text-sm font-medium dark:text-white">Contact Email</label
			>
			<input
				type="email"
				id="email"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				placeholder="example@business.com"
				aria-describedby="hs-input-helper-text"
				name="email"
			/>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.email}
					{$errors.email}
				{/if}
			</p>
		</div>

		<div>
			<label for="email" class="mb-2 block text-sm font-medium dark:text-white">Contact Phone</label
			>
			<input
				type="text"
				id="phone"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				placeholder="xxx-xxx-xxxx"
				aria-describedby="hs-input-helper-text"
				name="phone"
			/>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.phone}
					{$errors.phone}
				{/if}
			</p>
		</div>

		<div>
			<label for="email" class="mb-2 block text-sm font-medium dark:text-white">Webiste URL</label>
			<input
				type="text"
				id="website_url"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				placeholder="https://example.com"
				aria-describedby="hs-input-helper-text"
				name="website_url"
			/>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.website_url}
					{$errors.website_url}
				{/if}
			</p>
		</div>

		<Button title="Submit" type="primary" isLoading={$isSubmitting} />
	</form>
{/if}
