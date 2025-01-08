<script>
	import { signOut } from '$lib/auth.svelte'
	import { goto } from '$app/navigation'

	const handleSignOut = async () => {
		await signOut()
		goto('/sign-in')
	}
</script>

<h1>Account Settings (email/password)</h1>

<div>
	<button
		on:click={handleSignOut}
		type="button"
		class="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
	>
		Sign Out
	</button>
</div>
