<script lang="ts">
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import * as zod from 'zod'

	let status = $state<'IDLE' | 'LOADING' | 'SUCCESSFUL' | 'ERROR'>('IDLE')

	const schema = zod.object({
		firstName: zod.string().nonempty(),
		lastName: zod.string().nonempty(),
		email: zod.string().email().nonempty(),
		business: zod.string().optional(),
		businessURL: zod.string().nonempty()
	})

	const { form, errors, warnings, isValid } = createForm({
		extend: validator({ schema }),
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			business: '',
			businessURL: ''
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

<div
	class="mx-auto mt-12 max-w-lg rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
>
	<div class="p-4 sm:p-7">
		<div class="text-center">
			<div class="text-center">
				<h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Register</h1>
				<p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
					Already have an account?
					<a
						class="font-medium text-blue-800 decoration-2 hover:underline focus:underline focus:outline-none dark:text-blue-800"
						href="/sign-in"
					>
						Sign in here
					</a>
				</p>
			</div>
			<div
				class="mt-5 flex items-center py-3 text-xs uppercase text-gray-400 before:me-6 before:flex-1 before:border-t before:border-gray-200 after:ms-6 after:flex-1 after:border-t after:border-gray-200 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600"
			>
				Or
			</div>
			<p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
				Please fill out the form below. Once you click 'Create Account' you will receive a
				verification email.
			</p>
		</div>

		<div class="mt-5">
			<!-- Form -->
			{#if status === 'LOADING'}
				Loading...
			{/if}

			{#if status === 'SUCCESSFUL'}
				Successful!
			{/if}

			{#if status === 'ERROR'}
				Error with form
			{/if}
			<form use:form>
				<div class="grid gap-4 lg:gap-4">
					<!-- Grid -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-2">
						<div>
							<label for="hs-firstname" class="mb-2 block text-sm dark:text-white"
								>*First Name</label
							>
							<input
								type="text"
								name="firstName"
								class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							/>

							{#if $errors.firstName}
								{$errors.firstName}
							{/if}
						</div>

						<div>
							<label for="hs-lastname" class="mb-2 block text-sm dark:text-white">Last Name</label>
							<input
								type="text"
								name="lastName"
								class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							/>
						</div>
					</div>
					<!-- End Grid -->

					<!-- Grid -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-2">
						<div>
							<label for="hs-email" class="mb-2 block text-sm dark:text-white">*Email</label>
							<input
								type="email"
								name="email"
								autocomplete="email"
								class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							/>
							{#if $errors.email}
								{$errors.email}
							{/if}
						</div>

						<div>
							<label for="hs-phone" class="mb-2 block text-sm dark:text-white">Phone</label>
							<input
								type="text"
								name="business"
								class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							/>
						</div>
					</div>
					<!-- End Grid -->

					<!-- Grid -->
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-2">
						<div>
							<label for="hs-business-name" class="mb-2 block text-sm dark:text-white"
								>*Business Name</label
							>
							<input
								type="text"
								name="business"
								class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							/>
							{#if $errors.business}
								{$errors.business}
							{/if}
						</div>
						<div>
							<label for="hs-business-url" class="mb-2 block text-sm dark:text-white"
								>*Business Website</label
							>
							<input
								type="text"
								name="business"
								class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							/>
							{#if $errors.businessURL}
								{$errors.businessURL}
							{/if}
						</div>
					</div>
					<!-- End Grid -->

					<!-- Grid -->
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-2">
						<div>
							<label for="hs-password" class="mb-2 block text-sm dark:text-white">*Password</label>
							<input
								type="text"
								name="password"
								class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							/>
						</div>
						<div>
							<label for="hs-password" class="mb-2 block text-sm dark:text-white"
								>*Verify Password</label
							>
							<input
								type="text"
								name="password"
								class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							/>
						</div>
					</div>
					<!-- End Grid -->
					<p class="text-xs">(*) denotes required field</p>
					<div class="mt-2 grid">
						<button
							type="submit"
							class="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-800 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
							>Create Account</button
						>
					</div>
				</div>
			</form>
			<!-- End Form -->
		</div>
	</div>
</div>
