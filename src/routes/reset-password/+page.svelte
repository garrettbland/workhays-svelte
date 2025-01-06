<script lang="ts">
	import { resetPassword } from '$lib/auth.svelte'

	let email = $state('')
	let isResetting = $state(false)
	let isComplete = $state(false)
	let hasError = $state(false)

	const handlePasswordReset = async (email: string) => {
		try {
			isResetting = true
			hasError = false
			await resetPassword(email)
			isComplete = true
		} catch (error) {
			hasError = true
			console.error(error)
		} finally {
			isResetting = false
		}
	}
</script>

<h1>Password Reset</h1>
<p>Enter your email to reset your password</p>

{#if isComplete}
	<p>Check your email for a link to reset your password</p>
{/if}

{#if hasError}
	<p class="text-red-500">
		There was an error resetting your password, or there is no account with that email. Please try
		again.
	</p>
{/if}

<form on:submit|preventDefault={() => handlePasswordReset(email)}>
	<input type="email" placeholder="Email" bind:value={email} />
	<button>
		{#if isResetting}
			<span
				class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
				role="status"
				aria-label="loading"
			></span>
		{/if}
		{isResetting ? 'Loading...' : 'Reset Password'}</button
	>
</form>
