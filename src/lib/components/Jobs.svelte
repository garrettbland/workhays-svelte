<script lang="ts">
	import type { Job, JobWithID } from '$lib/types'
	import type { LastDocType } from '$lib/jobs'
	import { getPublicJobs } from '$lib/jobs'
	import type { INDUSTRIES } from '$lib/constants'
	import { untrack, onMount } from 'svelte'
	import { page } from '$app/state'
	import { cachedJobs, allCachedJobs, miscStorage, clearCachedData } from '$lib/cache.svelte'
	import { pushState } from '$app/navigation'
	import Loader from './Loader.svelte'
	import Button from './Button.svelte'
	import { getHumanDateFromFirebaseTimestamp } from '$lib/date'

	/**
	 * Arguments
	 */
	let { industry } = $props()

	let isLoadingInitial = $state(true)
	let isLoadingMore = $state<boolean>(false)
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
			if (lastVisibleDoc) {
				isLoadingMore = true
			} else {
				isLoadingInitial = true
			}

			const data = await getPublicJobs({
				industry: industry,
				lastVisibleDoc: lastVisibleDoc
			})

			jobs = {
				...jobs,
				...data.jobs
			}

			if (lastVisibleDoc) {
				isLoadingMore = true
			} else {
				isLoadingInitial = true
			}
		} catch (err) {
			console.error(err)
			hasError = true
		} finally {
			isLoadingInitial = false
			isLoadingMore = false
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

{#if isLoadingInitial}
	<Loader />
{/if}

{#if !isLoadingInitial && jobs}
	<div class="flex flex-col">
		<div class="-m-1.5 overflow-x-auto">
			<div class="inline-block min-w-full p-1.5 align-middle">
				<div class="overflow-hidden rounded-lg border border-gray-200 shadow-xs">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr class="grid grid-cols-3 px-6">
								<th scope="col" class="py-3 text-start text-xs font-medium text-gray-500 uppercase"
									>Title</th
								>

								<th scope="col" class="py-3 text-start text-xs font-medium text-gray-500 uppercase"
									>Employer</th
								>
								<th scope="col" class="py-3 text-end text-xs font-medium text-gray-500 uppercase"
									>Updated</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each Object.entries(jobs) as [id, job]}
								<tr class="grid grid-cols-3 hover:bg-gray-50">
									<td class="truncate text-start text-sm whitespace-nowrap text-gray-800"
										><a href={`/jobs/${id}`} class="block py-4 pl-6">{job.title}</a></td
									>
									<td class="truncate text-sm whitespace-nowrap text-gray-800"
										><a href={`/jobs/${id}`} class="block py-4 pl-2">{job.employerTitle}</a></td
									>

									<td class=" text-end text-sm whitespace-nowrap text-gray-800"
										><a href={`/jobs/${id}`} class="block py-4 pr-6"
											>{getHumanDateFromFirebaseTimestamp(job.updatedAt)}</a
										></td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	{#if miscStorage.lastSeenDoc === 'LAST'}
		<div class=" flex w-full justify-center">
			<p class="prose prose-sm py-4 text-gray-500">No more job listings in this industry</p>
		</div>
	{/if}
	{#if miscStorage.lastSeenDoc !== 'LAST'}
		<div class="flex w-full justify-center py-4">
			<Button
				title="Load More"
				type="primary"
				disabled={isLoadingMore}
				isLoading={isLoadingMore}
				onclick={() => handleLoadMore(miscStorage.lastSeenDoc!)}
				loadingText="Loading..."
			/>
		</div>
	{/if}
{/if}

{#if hasError}
	<!-- promise was rejected -->
	<p>Something went wrong</p>
{/if}
