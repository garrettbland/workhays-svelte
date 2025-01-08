<script>
	import { goto } from '$app/navigation'
	import { ADMIN_NAV_LINKS } from '$lib/constants'
	import { authData } from '$lib/auth.svelte'

	let { children } = $props()

	$effect(() => {
		if (!authData.isLoading && !authData.user) {
			goto('/sign-in')
		}
	})
</script>

{#if authData.isLoading || !authData.user}
	<p>Loading...</p>
{:else}
	<div class="grid grid-cols-12 gap-6">
		<div class="col-span-3">
			<div class="max-w-32 border-e-2 border-gray-200 dark:border-neutral-700">
				<nav class="-me-0.5 flex flex-col space-y-3">
					{#each ADMIN_NAV_LINKS as link}
						<a
							class="inline-flex items-center gap-2 whitespace-nowrap border-e-2 border-transparent py-1 pe-4 text-sm text-gray-500 no-underline hover:text-blue-800 focus:text-blue-800 focus:outline-none dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
							href={link.href}
						>
							{link.name}
						</a>
					{/each}
				</nav>
			</div>
		</div>
		<div class="col-span-9">
			{@render children()}
		</div>
	</div>
{/if}
