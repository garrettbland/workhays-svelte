<script lang="ts">
	import type { Job, JobWithID } from '$lib/types'
	import type { LastDocType } from '$lib/jobs'
	import { getPublicJobs } from '$lib/jobs'
	import type { INDUSTRIES } from '$lib/constants'
	import { untrack, onMount } from 'svelte'
	import { page } from '$app/state'
	import { cachedJobs, allCachedJobs, miscStorage } from '$lib/cache.svelte'
	import { pushState } from '$app/navigation'

	/**
	 * Arguments
	 */
	let { industry } = $props()

	let isLoading = $state<boolean>(false)
	let hasError = $state<boolean>(false)
	let jobs = $state<Record<string, Job>>({})

	const getJobs = async ({
		industry,
		lastVisibleDoc
	}: {
		industry?: INDUSTRIES
		lastVisibleDoc?: LastDocType
	}) => {
		try {
			isLoading = true

			const data = await getPublicJobs({
				industry: industry,
				lastVisibleDoc: lastVisibleDoc
			})

			jobs = {
				...jobs,
				...data.jobs
			}

			isLoading = false
		} catch (err) {
			console.error(err)
			hasError = true
		} finally {
			isLoading = false
		}
	}

	// Below was used to stop infinite loading thing
	// $effect(() => {
	// 	if (industry) {
	// 		untrack(() => {
	// 			getJobs(industry)
	// 		})
	// 	}
	// })

	const handleLoadMore = async (lastDoc) => {
		// console.log(`Loading more jobs in ${industry}`)

		getJobs({
			industry: industry,
			lastVisibleDoc: lastDoc
		})
	}

	onMount(() => {
		getJobs({
			industry: industry
		})
	})

	// const handleJobLink = (id: string) => {
	// 	// pushState(`/jobs/${id}`, {
	// 	// 	showModal: true
	// 	// })
	// 	pushState(`/jobs/${id}`, {
	// 		showJob: true
	// 	})
	// }
</script>

{#if isLoading}
	<!-- promise is pending -->
	<div class="flex flex-1 flex-col items-center gap-6">
		<div class="text-2xl font-bold">Loading opportunities..yay! 😃</div>
		<div
			class="inline-block size-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-800 dark:text-blue-800"
			role="status"
			aria-label="loading"
		></div>
	</div>
{/if}

{#if !isLoading && jobs}
	<!-- promise was fulfilled or not a Promise -->
	<ul class="list-inside list-none p-0">
		{#each Object.entries(jobs) as [id, job]}
			<a class="group/item no-underline" href={`/jobs/${id}`}>
				<li
					class="flex w-full items-center gap-4 rounded-lg border border-gray-200 px-6 py-4 duration-300 ease-in-out hover:cursor-pointer hover:border-blue-800 hover:shadow-md hover:transition-all"
				>
					<div class="flex-1">
						<div class="text-sm font-normal text-gray-700">Employer Name</div>
						<div class="group/job text-lg font-bold group-hover/item:underline">
							{job.title}
						</div>
					</div>
					<div class="flex items-center gap-4">
						<div class="text-sm font-normal text-gray-700">Jan 1, 2025</div>
						<svg
							class="group/chevron size-4 shrink-0 group-hover/item:text-blue-800"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="m9 18 6-6-6-6"></path>
						</svg>
					</div>
				</li>
			</a>
		{/each}
		{#if miscStorage.lastSeenDoc === 'LAST'}
			<div class="flex w-full justify-center">
				<p class="font-bold text-gray-500">-- End of job listings --</p>
			</div>
		{/if}
		{#if miscStorage.lastSeenDoc !== 'LAST'}
			<div class="flex w-full justify-center">
				<button
					class="flex gap-x-2 rounded-lg border border-transparent bg-blue-800 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
					onclick={() => handleLoadMore(miscStorage.lastSeenDoc!)}>Load more jobs</button
				>
			</div>
		{/if}
	</ul>
{/if}

{#if hasError}
	<!-- promise was rejected -->
	<p>Something went wrong</p>
{/if}
