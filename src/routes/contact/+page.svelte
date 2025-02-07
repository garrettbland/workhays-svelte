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
			<h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Contact us</h1>
			<p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
				Please fill out the following form to contact us.
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
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-2">
						<div>
							<label for="hs-firstname-contacts-1" class="mb-2 block text-sm dark:text-white"
								>First Name</label
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
							<label for="hs-lastname-contacts-1" class="mb-2 block text-sm dark:text-white"
								>Last Name</label
							>
							<input
								type="text"
								name="lastName"
								class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							/>
						</div>
					</div>
					<!-- End Grid -->

					<!-- Grid -->
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-2">
						<div>
							<label for="hs-email-contacts-1" class="mb-2 block text-sm dark:text-white"
								>Email</label
							>
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
							<label for="hs-business-name" class="mb-2 block text-sm dark:text-white"
								>Business Name</label
							>
							<input
								type="text"
								name="business"
								class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							/>
						</div>
					</div>
					<!-- End Grid -->

					<div>
						<label for="hs-message" class="mb-2 block text-sm dark:text-white">Details</label>
						<textarea
							name="message"
							rows="4"
							class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
						></textarea>
					</div>
				</div>
				<!-- End Grid -->

				<div class="mt-6 grid">
					<button
						type="submit"
						class="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-800 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
						>Send inquiry</button
					>
				</div>

				<div class="mt-3 text-center">
					<p class="text-sm text-gray-600 dark:text-neutral-400">
						We'll get back to you as soon as we can!
					</p>
				</div>
			</form>
			<!-- End Form -->
		</div>
	</div>
</div>
