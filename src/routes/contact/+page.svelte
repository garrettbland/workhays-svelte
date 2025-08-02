<script lang="ts">
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import * as zod from 'zod'
	import Button from '$lib/components/Button.svelte'
	import Alert from '$lib/components/Alert.svelte'

	let status = $state<'IDLE' | 'LOADING' | 'SUCCESSFUL' | 'ERROR'>('IDLE')

	const schema = zod.object({
		firstName: zod.string().nonempty(),
		lastName: zod.string().nonempty(),
		email: zod.string().email().nonempty(),
		business: zod.string().optional(),
		message: zod.string().nonempty()
	})

	const { form, errors, warnings, isValid } = createForm({
		extend: validator({ schema }),
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			business: '',
			message: ''
		},
		onSubmit: async (values, context) => {
			status = 'LOADING'
			try {
				if (!isValid) {
					throw new Error('Validation issue')
				}
				const response = await fetch('/contact', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(values)
				})

				if (response.status !== 201) {
					throw new Error(`Error submitting`)
				}

				window.scrollTo(0, 0) // Scroll to top on success
				return await response.json()
			} catch (err) {
				throw new Error(err)
			}
		},
		onSuccess(response, context) {
			context.reset()
			status = 'SUCCESSFUL'
		},
		onError(err, context) {
			status = 'ERROR'
		}
	})
</script>

<div class="prose prose-sm">
	{#if status !== 'IDLE'}
		<div class="mb-8">
			{#if status === 'LOADING'}
				<Alert type="secondary" title="Submitting your message..." />
			{/if}

			{#if status === 'SUCCESSFUL'}
				<Alert type="success" title="Thank you for your message! We will get back to you soon." />
			{/if}

			{#if status === 'ERROR'}
				<Alert
					type="warning"
					title="There was an error submitting your message. Please try again."
				/>
			{/if}
		</div>
	{/if}

	<h1>Contact Us</h1>
	<p>
		Drop us a message and we will get back to you as soon as possible. We are here to help with any
		questions, feedback, or issues you may have. Your feedback is important to us and helps us
		improve the platform.
	</p>

	<form use:form class="space-y-4">
		<!-- First Name-->
		<div>
			<label for="firstName" class="mb-2 block text-sm font-medium dark:text-white"
				>First Name</label
			>
			<input
				type="text"
				id="firstName"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				placeholder="First Name"
				name="firstName"
			/>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.firstName}
					{$errors.firstName}
				{/if}
			</p>
		</div>

		<!-- Last Name -->
		<div>
			<label for="lastName" class="mb-2 block text-sm font-medium dark:text-white">Last Name</label>
			<input
				type="text"
				id="lastName"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				placeholder="Last Name"
				name="lastName"
			/>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.lastName}
					{$errors.lastName}
				{/if}
			</p>
		</div>

		<!-- <input name="firstName" type="text" />
	{#if $errors.firstName}
		{$errors.firstName}
	{/if} -->
		<!-- <input name="lastName" type="text" /> -->

		<!-- <input name="email" type="email" />
	{#if $errors.email}
		{$errors.email}
	{/if} -->

		<!-- Email -->
		<div>
			<label for="email" class="mb-2 block text-sm font-medium dark:text-white">Email</label>
			<input
				type="email"
				id="email"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				placeholder="Email Address"
				name="email"
			/>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.email}
					{$errors.email}
				{/if}
			</p>
		</div>

		<!-- <input name="businessName" type="text" /> -->

		<!-- Business -->
		<div>
			<label for="business" class="mb-2 block text-sm font-medium dark:text-white"
				>Business Name (optional)</label
			>
			<input
				type="text"
				id="business"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				placeholder="Business Name"
				name="business"
			/>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.business}
					{$errors.business}
				{/if}
			</p>
		</div>

		<!-- <textarea name="message"></textarea> -->

		<!-- Business -->
		<div>
			<label for="business" class="mb-2 block text-sm font-medium dark:text-white">Message</label>
			<textarea
				rows="5"
				id="message"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				placeholder="Your message here"
				name="message"
			></textarea>
			<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
				{#if $errors.message}
					{$errors.message}
				{/if}
			</p>
		</div>
		<Button title="Submit" type="primary" isLoading={status === 'LOADING'} />
	</form>
</div>
