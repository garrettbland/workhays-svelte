<script lang="ts">
	import type { Job, JobWithID } from '$lib/types'
	import type { LastDocType } from '$lib/jobs'
	import { getPublicJobs } from '$lib/jobs'
	import type { INDUSTRIES } from '$lib/constants'
	import { untrack, onMount } from 'svelte'
	import { page } from '$app/state'

	/**
	 * Arguments
	 */
	let { industry } = $props()

	let isLoading = $state<boolean>(false)
	let hasError = $state<boolean>(false)
	let jobs = $state<Record<string, Job>>({})
	let lastJobLoaded = $state<LastDocType>()

	const getJobs = async ({
		industry,
		lastVisibleDoc
	}: {
		industry?: INDUSTRIES
		lastVisibleDoc?: LastDocType
	}) => {
		console.log(`Getting jobs by industry: ${industry}`)
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

			// jobs = [...jobs, ...data.jobs]
			lastJobLoaded = data.lastDoc
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

	const handleLoadMore = async (lastVisibleDoc: Job) => {
		console.log(`Loading more jobs in ${industry}`)
		getJobs({
			industry: industry,
			lastVisibleDoc
		})
	}

	onMount(() => {
		getJobs({
			industry: industry
		})
	})
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
		{#if lastJobLoaded === 'LAST'}
			END OF JOBS
		{/if}
		{#if lastJobLoaded !== 'LAST'}
			<button onclick={() => handleLoadMore(lastJobLoaded!)}>Load More</button>
		{/if}
	</ul>
{/if}

{#if hasError}
	<!-- promise was rejected -->
	<p>Something went wrong</p>
{/if}
