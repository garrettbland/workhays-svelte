<script lang="ts">
	import Popover from './Popover.svelte'
	import { goto } from '$app/navigation'
	import type { UserWithID } from '$lib/types'
	import { changeEmail, signOut } from '$lib/auth.svelte'
	import type { User as FirebaseAuthUser } from 'firebase/auth'

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

<h2>Auth</h2>
<p>
	Changing email will sign you out. A confirmation email will be sent to original holders email
	address as a security measure and incase this was an accident to reverse.
</p>
{#if isEmailLoading}
	Updating email...
{/if}
{#if hasEmailError}
	Error updating email.
{/if}
{#if isEmailSuccess}
	Successful email update.
{/if}

<form onsubmit={(event) => handleEmailChange(event, newEmail, password)}>
	<label for="Email">Email</label>
	<input bind:value={newEmail} type="text" id="email" name="email" required />

	<label for="Password">Password</label>
	<input bind:value={password} type="password" name="password" required />

	<button name="change-email" type="submit">{isEmailLoading ? 'Loading...' : 'Submit'}</button>
</form>
