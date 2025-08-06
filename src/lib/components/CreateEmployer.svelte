<script lang="ts">
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import * as zod from 'zod'
	import Button from '$lib/components/Button.svelte'
	import Alert from '$lib/components/Alert.svelte'
	import type { User } from '$lib/types'
	import { createEmployer } from '$lib/employer.admin'
	import type { JSONContent } from '@tiptap/core'
	import RichText from './RichText.svelte'
	import { updateUserById } from '$lib/users.admin'
	import { clearCachedData } from '$lib/cache.svelte'
	import { goto } from '$app/navigation'

	let {
		userId
	}: {
		userId: User['uid']
	} = $props()

	let formErrorMessage = $state<string | null>(null)
	let employerDescription = $state<JSONContent>()

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
			title: '',
			description: {} as JSONContent,
			contact: '',
			email: '',
			phone: undefined,
			website_url: undefined
		},
		onSubmit: async (values, context) => {
			try {
				formErrorMessage = null

				const { status, employerId } = await createEmployer(
					{
						title: values.title,
						description: values.description, // Assuming description is a rich text field
						contact: values.contact,
						email: values.email,
						phone: values.phone,
						website_url: values.website_url
					},
					userId
				)

				if (status !== 'SUCCESS' || !employerId) {
					formErrorMessage = 'There was an issue creating a new employer. Please try again.'
					return
				}

				/**
				 * Update the user with the new employer ID
				 */
				await updateUserById(userId, {
					memberOf: [employerId]
				})

				clearCachedData()
				// goto('/admin/dashboard') // not sure why this isn't working
				window.location.href = '/admin/dashboard'
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
		setFields('description', employerDescription)
	})
</script>

<form use:form class="space-y-8">
	<div>
		<label for="title" class="mb-2 block text-sm font-medium dark:text-white">Employer Title</label>
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

		<RichText bind:value={employerDescription} placeholder="Enter some info about this employer." />
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
		<label for="email" class="mb-2 block text-sm font-medium dark:text-white">Contact Email</label>
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
		<label for="email" class="mb-2 block text-sm font-medium dark:text-white">Contact Phone</label>
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

	{#if formErrorMessage}
		<Alert type="warning" title={`${formErrorMessage}`} />
	{/if}

	<Button title="Submit" type="primary" isLoading={$isSubmitting} />
</form>
