<script lang="ts">
	import { authData, signOut } from '$lib/auth.svelte'
	import { goto } from '$app/navigation'
	import type { UserWithID } from '$lib/types'
	import { updateUserById } from '$lib/users.admin'

	let user = $state(authData.user ? { ...authData.user } : ({} as UserWithID))
	let isLoading = $state(false)
	let hasError = $state(false)
	let isSuccess = $state(false)

	const handleSignOut = async () => {
		await signOut()
		goto('/sign-in')
	}

	const handleSubmit = async (userId: string, updatedFields: Partial<UserWithID>) => {
		try {
			isLoading = true
			hasError = false
			isSuccess = false
			await updateUserById(userId, updatedFields)
			isSuccess = true
		} catch (err) {
			hasError = true
		} finally {
			isLoading = false
		}
	}
</script>

<h1>Account Settings (email/password)</h1>

<h1>Edit User: {authData.user?.firstName}</h1>
{#if isLoading}
	Updating user...
{/if}
{#if hasError}
	Error updating user
{/if}
{#if isSuccess}
	Successful user update
{/if}

<form on:submit|preventDefault={() => handleSubmit(user?.id ?? '', user ?? {})}>
	<label for="title">First Name</label>
	<input bind:value={user.firstName} type="text" id="firstName" name="firstName" required />

	<label for="description">Last Name</label>
	<input bind:value={user.lastName} type="text" id="lastName" name="lastName" required />

	<button type="submit">{isLoading ? 'Loading...' : 'Submit'}</button>
</form>

<div>
	<button
		on:click={handleSignOut}
		type="button"
		class="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
	>
		Sign Out
	</button>
</div>
