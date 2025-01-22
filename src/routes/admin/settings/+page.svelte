<script lang="ts">
	import { authData } from '$lib/auth.svelte'
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
	<h1>Edit Employer: {employer.title}</h1>
	{#if isLoading}
		Updating employer...
	{/if}
	{#if hasError}
		Error updating employer
	{/if}
	{#if isSuccess}
		Successful employer update
	{/if}
	<form on:submit|preventDefault={() => handleSubmit(employer.id, employer)}>
		<label for="title">Title</label>
		<input bind:value={employer.title} type="text" id="title" name="title" required />

		<label for="description">Description</label>
		<textarea bind:value={employer.description} id="description" name="description" required
		></textarea>

		<button type="submit">{isLoading ? 'Loading...' : 'Submit'}</button>
	</form>
{:catch error}
	<div>Error loading employer</div>
{/await}
