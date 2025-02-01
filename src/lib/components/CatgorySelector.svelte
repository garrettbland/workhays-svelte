<script lang="ts">
	import { INDUSTRIES } from '$lib/constants'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { clearCachedData } from '$lib/cache.svelte'

	let selected = $state(page.params.industry)

	const handleCategoryChange = (industry: INDUSTRIES | 'all') => {
		/**
		 * Clear cached data when changing industries
		 */
		clearCachedData()

		if (industry === 'all') {
			return goto(`/`)
		}
		goto(`/industries/${industry}`)
	}
</script>

<select
	bind:value={selected}
	on:change={(e) => handleCategoryChange(e.target.value)}
	class="z-10 flex-1 rounded-lg border-gray-200 p-4 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
>
	<option value="all" selected>All Industries</option>
	{#each Object.entries(INDUSTRIES) as option}
		<option value={option[1]}>
			{option[0]}
		</option>
	{/each}
</select>
