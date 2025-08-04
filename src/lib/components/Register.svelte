<script lang="ts">
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import * as zod from 'zod'
	import Button from '$lib/components/Button.svelte'
	import Alert from '$lib/components/Alert.svelte'
	import { onMount } from 'svelte'
	import type { User } from '$lib/types'
	// import Error from '../../routes/+error.svelte'
	// import { parse } from 'svelte/compiler'

	let { onSuccess }: { onSuccess: (newUser: User) => void } = $props()
	let formErrorMessage = $state<string | null>(null)

	const schema = zod
		.object({
			firstName: zod.string().nonempty(),
			lastName: zod.string().nonempty(),
			email: zod.string().email().nonempty(),
			password: zod.string().nonempty().min(6, 'Password must be at least 6 characters long'),
			password_confirm: zod.string().nonempty()
		})
		.refine((data) => data.password === data.password_confirm, {
			message: "Passwords don't match",
			path: ['password_confirm'] // attach error to password_confirm field
		})

	const { form, errors, warnings, isValid, setErrors, isSubmitting } = createForm({
		extend: validator({ schema }),
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			password_confirm: ''
		},
		onSubmit: async (values, context) => {
			try {
				formErrorMessage = null
				const response = await fetch('/register/user', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(values)
				})

				const parsedResponse = await response.json()

				console.log(parsedResponse)

				if (parsedResponse.status !== 'SUCCESS') {
					if (parsedResponse.message.startsWith('auth')) {
						formErrorMessage =
							'There was an issue with your information, or the email already in use. Please try again.'
					} else {
						formErrorMessage = 'An error occurred while registering. Please try again.'
					}
				} else {
					onSuccess(parsedResponse.newUser)
				}

				// return await response.json()
			} catch (err) {
				formErrorMessage = 'Something went wrong while submitting the form. Please try again.'
			}
		}
		// onSuccess(response, context) {
		// 	context.reset()
		// 	onSuccess(response.newUser.uid) // Assuming the response contains the new user ID
		// }
	})
</script>

<!-- 
{#if status !== 'IDLE'}
	<div class="mb-8">
		{#if status === 'LOADING'}
			<Alert type="secondary" title="Submitting your message..." />
		{/if}

		{#if status === 'SUCCESSFUL'}
			<Alert type="success" title="Thank you for your message! We will get back to you soon." />
		{/if}

		{#if status === 'ERROR'}
			<Alert type="warning" title="There was an error submitting your message. Please try again." />
		{/if}
	</div>
{/if} -->

<form use:form class="space-y-4">
	<!-- First Name-->
	<div>
		<label for="firstName" class="mb-2 block text-sm font-medium dark:text-white">First Name</label>
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

	<!-- Password -->
	<div>
		<label for="password" class="mb-2 block text-sm font-medium dark:text-white">Password</label>
		<input
			type="password"
			id="password"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="Password"
			name="password"
		/>
		<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
			{#if $errors.password}
				{$errors.password}
			{/if}
		</p>
	</div>

	<!-- Password Confirm -->
	<div>
		<label for="password_confirm" class="mb-2 block text-sm font-medium dark:text-white"
			>Confirm Password</label
		>
		<input
			type="password"
			id="password_confirm"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="Confirm Password"
			name="password_confirm"
		/>
		<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">
			{#if $errors.password_confirm}
				{$errors.password_confirm}
			{/if}
		</p>
	</div>

	{#if formErrorMessage}
		<Alert type="warning" title={`${formErrorMessage}`} />
	{/if}

	<Button title="Submit" type="primary" isLoading={$isSubmitting} />
</form>
