<script lang="ts">
	import Popover from './Popover.svelte'
	import { goto } from '$app/navigation'
	import type { UserWithID } from '$lib/types'
	import { changeEmail, signOut } from '$lib/auth.svelte'
	import type { User as FirebaseAuthUser } from 'firebase/auth'
	import Button from './Button.svelte'
	import Alert from './Alert.svelte'

	let { auth }: { auth: FirebaseAuthUser | null } = $props()

	let newEmail = $state(auth?.email ?? '')
	let password = $state('')
	let isEmailLoading = $state(false)
	let hasEmailError = $state(false)
	let isEmailSuccess = $state(false)

	const handleSignOut = async () => {
		await signOut()
		goto('/sign-in?emailChanged=true')
	}

	const handleEmailChange = async (event: SubmitEvent, email: string, confirmPassword: string) => {
		event.preventDefault()

		try {
			isEmailLoading = true
			hasEmailError = false
			isEmailSuccess = false

			console.log(`User is changing email from ${auth?.email} to ${email}`)
			await changeEmail(auth?.email ?? '', email, confirmPassword)
			await handleSignOut()
			isEmailSuccess = true
		} catch (err) {
			hasEmailError = true
		} finally {
			isEmailLoading = false
		}
	}
</script>

<div class="prose prose-sm mb-4">
	<h2>Email Settings</h2>
	<p>
		Changing email will sign you out. A confirmation email will be sent to original holders email
		address as a security measure and incase this was an accident to reverse.
	</p>
</div>

<div class="mb-4">
	{#if isEmailLoading}
		<Alert type="info" title="Updating email..." />
	{/if}
	{#if hasEmailError}
		<Alert
			type="warning"
			title="Error updating email. Please try again. If the issue persists, please contact us"
		/>
	{/if}
	{#if isEmailSuccess}
		<Alert
			type="warning"
			title="Success - Your email has been updated. You should be signed out automatically."
		/>
	{/if}
</div>

<form onsubmit={(event) => handleEmailChange(event, newEmail, password)} class="space-y-8">
	<div>
		<label for="email" class="mb-2 block text-sm font-medium dark:text-white">Email Address</label>
		<input
			type="email"
			id="email"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="Sales Associate"
			aria-describedby="hs-input-helper-text"
			name="email"
			bind:value={newEmail}
			required
		/>
	</div>

	<!-- <label for="Email">Email</label>
	<input bind:value={newEmail} type="text" id="email" name="email" required /> -->

	<div>
		<label for="password" class="mb-2 block text-sm font-medium dark:text-white">Password</label>
		<input
			type="password"
			id="password"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="Password"
			aria-describedby="hs-input-helper-text"
			name="password"
			bind:value={password}
			required
		/>
	</div>

	<!-- <label for="Password">Password</label>
	<input bind:value={password} type="password" name="password" required /> -->

	<Button title="Change Email" type="primary" isLoading={isEmailLoading} />
	<!-- <button name="change-email" type="submit">{isEmailLoading ? 'Loading...' : 'Submit'}</button> -->
</form>
