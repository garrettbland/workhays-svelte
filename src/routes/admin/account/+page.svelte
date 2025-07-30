<script lang="ts">
	import { authData, signOut } from '$lib/auth.svelte'
	import type { UserWithID } from '$lib/types'
	import { updateUserById } from '$lib/users.admin'
	import { goto } from '$app/navigation'
	import ChangeEmail from '$lib/components/ChangeEmail.svelte'
	import Button from '$lib/components/Button.svelte'
	import Alert from '$lib/components/Alert.svelte'

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

<div class="prose prose-sm mb-4">
	<h1>Account</h1>
</div>

<!-- <h1>Edit User: {authData.user?.firstName}</h1> -->
<div class="mb-4">
	{#if isLoading}
		<Alert type="secondary" title="Updating user..." />
	{/if}
	{#if hasError}
		<Alert type="warning" title="Error updating user. Please try again." />
	{/if}
	{#if isSuccess}
		<Alert type="success" title="User updated successfully." />
	{/if}
</div>

<div class="prose prose-sm mb-4">
	<h2>Personal Information</h2>
</div>
<form
	on:submit|preventDefault={() => handleUserDetailsSubmit(user.id, user)}
	class="mb-12 space-y-8"
>
	<div>
		<label for="first_name" class="mb-2 block text-sm font-medium dark:text-white">First Name</label
		>
		<input
			type="text"
			id="first_name"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="Sales Associate"
			aria-describedby="hs-input-helper-text"
			name="first_name"
			bind:value={user.firstName}
			required
		/>
	</div>

	<div>
		<label for="last_name" class="mb-2 block text-sm font-medium dark:text-white">Last Name</label>
		<input
			type="text"
			id="last_name"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="Sales Associate"
			aria-describedby="hs-input-helper-text"
			name="last_name"
			bind:value={user.lastName}
			required
		/>
	</div>

	<Button
		title="Update User"
		type="primary"
		buttonType="submit"
		disabled={isLoading}
		{isLoading}
		loadingText="Updating..."
	/>
</form>

<div class="mb-12">
	<ChangeEmail auth={authData.auth} />
</div>

<div class="prose prose-sm mb-4">
	<h2>Actions</h2>
</div>
<div>
	<Button title="Sign Out" type="secondary" onclick={handleSignOut} />
</div>
