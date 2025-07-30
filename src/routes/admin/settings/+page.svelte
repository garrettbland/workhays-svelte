<script lang="ts">
	import { authData } from '$lib/auth.svelte'
	import Alert from '$lib/components/Alert.svelte'
	import RichText from '$lib/components/RichText.svelte'
	import { getEmployerById, updateEmployerById } from '$lib/employer.admin'
	import type { Employer, EmployerWithID } from '$lib/types'

	let currentEmployer = $state(getEmployerById(authData.user?.memberOf[0] ?? ''))
	let isLoading = $state(false)
	let hasError = $state(false)
	let isSuccess = $state(false)

	const handleSubmit = async (employerId: string, updatedFields: Partial<EmployerWithID>) => {
		try {
			isLoading = true
			hasError = false
			isSuccess = false
			await updateEmployerById(employerId, updatedFields)
			isSuccess = true
		} catch (err) {
			hasError = true
		} finally {
			isLoading = false
		}
	}
</script>

{#await currentEmployer}
	<div>Loading...</div>
{:then employer}
	<div class="prose prose-sm mb-4">
		<h1>Edit Employer</h1>
	</div>

	<div class="mb-4">
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
	</div>

	<form
		onsubmit={(e) => {
			e.preventDefault()
			handleSubmit(employer.id, employer)
		}}
		class="space-y-8"
	>
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
				bind:value={employer.title}
			/>
			<!-- <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500" id="hs-input-helper-text">
			Helper text
		</p> -->
		</div>

		<div>
			<label for="description" class="mb-2 block text-sm font-medium dark:text-white"
				>Employer Description</label
			>
			<RichText
				bind:value={employer.description}
				placeholder="Enter some info about this employer."
			/>
		</div>

		<button
			type="submit"
			class="focus:outline-hidden inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
			>{isLoading ? 'Loading...' : 'Submit'}</button
		>
	</form>
{:catch error}
	<div>Error loading employer</div>
{/await}
