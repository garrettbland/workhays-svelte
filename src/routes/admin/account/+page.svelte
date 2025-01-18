<script lang="ts">
	import { authData, signOut } from '$lib/auth.svelte'
	import type { UserWithID } from '$lib/types'
	import { updateUserById } from '$lib/users.admin'
	import { goto } from '$app/navigation'
	import ChangeEmail from '$lib/components/ChangeEmail.svelte'

	let user = $state(authData.user ? { ...authData.user } : ({} as UserWithID))
	let isLoading = $state(false)
	let hasError = $state(false)
	let isSuccess = $state(false)

	const handleSignOut = async () => {
		await signOut()
		goto('/sign-in')
	}

	const handleUserDetailsSubmit = async (userId: string, updatedFields: UserWithID) => {
		try {
			isLoading = true
			hasError = false
			isSuccess = false

			await updateUserById(userId, updatedFields)
			authData.user = {
				...authData.user,
				...updatedFields
			}
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

<h2>Personal Info</h2>
<form on:submit|preventDefault={() => handleUserDetailsSubmit(user.id, user)}>
	<label for="title">First Name</label>
	<input bind:value={user.firstName} type="text" id="firstName" name="firstName" required />

	<label for="Last Name">Last Name</label>
	<input bind:value={user.lastName} type="text" id="lastName" name="lastName" required />

	<button name="" type="submit">{isLoading ? 'Loading...' : 'Submit'}</button>
</form>

<ChangeEmail auth={authData.auth} />

<h2>Actions</h2>
<div>
	<button
		on:click={handleSignOut}
		type="button"
		name="sign-out"
		class="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
	>
		Sign Out
	</button>
</div>
