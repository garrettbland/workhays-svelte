<script lang="ts">
	import { goto } from '$app/navigation'
	import { authData } from '$lib/auth.svelte'
	import Alert from '$lib/components/Alert.svelte'
	import { page } from '$app/state'
	// import { use } from 'marked'

	$effect(() => {
		if (!authData.isLoading && !authData.auth) {
			goto('/sign-in')
		}
		if (authData.user?.memberOf && authData.user?.memberOf.length > 0) {
			goto('/admin/dashboard')
		}
	})
</script>

{#if !authData.user}
	<Alert type="secondary" title="Loading..." />
{:else if authData.user?.emailVerified === false}
	<div class="prose prose-sm mb-4">
		<h1>Email Validation Required</h1>
		<p>Thank you for creating an account with us, but your email has not been verified yet.</p>
		<p>TO DO: Send a verifiaction link automatically</p>
		<p>TO DO: Add a "send verification email button"</p>
		<p>
			Please check your email for a verification link. If you do not see it, please check your spam
			folder.
		</p>
		<p>
			If you have not received an email, please <a href="/contact">contact us</a>. We apologize for
			the inconvenience.
		</p>
	</div>
{:else if !authData?.user.memberOf || authData.user?.memberOf.length === 0}
	<div class="prose prose-sm mb-4">
		<h1>Complete Registration</h1>
		<p class="rounded-lg border border-green-300 bg-green-50 p-2">Your email has been verified</p>
		<p>You can now proceed to register your employer account below.</p>
		TO DO : FINISH
	</div>
{:else}
	<Alert type="secondary" title="Loading..." />
{/if}
