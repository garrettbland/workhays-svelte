<script lang="ts">
	import { INDUSTRIES } from '$lib/constants'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { clearCachedData } from '$lib/cache.svelte'

	let selected = $state(page.params.industry)

	const handleCategoryChange = (industry: INDUSTRIES | 'all') => {
		if (industry === 'all') {
			return goto(`/`)
		}
		goto(`/industries/${industry}`)
	}
</script>

<!-- Floating Select -->
<div class="relative">
	<select
		bind:value={selected}
		onchange={(e) => handleCategoryChange(e.target.value)}
		class="peer block w-full rounded-lg border-gray-200 p-4 pe-9 text-sm not-placeholder-shown:pt-6 not-placeholder-shown:pb-2 autofill:pt-6 autofill:pb-2 focus:border-blue-500 focus:pt-6 focus:pb-2 focus:ring-blue-500
  disabled:pointer-events-none
  disabled:opacity-50
  dark:border-neutral-700
  dark:bg-neutral-900
  dark:text-neutral-400
  dark:focus:ring-neutral-600"
	>
		<option value="all" selected>All Industries</option>
		{#each Object.entries(INDUSTRIES) as option}
			<option value={option[1]}>
				{option[0]}
			</option>
		{/each}
	</select>
	<label
		class="pointer-events-none absolute start-0 top-0 h-full truncate border border-transparent p-4 transition duration-100 ease-in-out peer-not-placeholder-shown:-translate-y-1.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-500
    peer-focus:-translate-y-1.5
    peer-focus:text-xs
    peer-focus:text-gray-500 peer-disabled:pointer-events-none
    peer-disabled:opacity-50
    dark:text-neutral-500
    dark:text-white dark:peer-not-placeholder-shown:text-neutral-500 dark:peer-focus:text-neutral-500"
		>Industry</label
	>
</div>
<!-- End Floating Select -->
<!-- 
<select bind:value={selected} on:change={(e) => handleCategoryChange(e.target.value)} class="mt-4">
	<option value="all" selected>All Industries</option>
	{#each Object.entries(INDUSTRIES) as option}
		<option value={option[1]}>
			{option[0]}
		</option>
	{/each}
</select> -->
