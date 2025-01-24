<script lang="ts">
	import { getPublicJobs } from '$lib/jobs'
	import type { LastDocType } from '$lib/jobs'
	import SEO from '$lib/components/SEO.svelte'
	import { SITE_NAME } from '$lib/constants'
	import CatgorySelector from '$lib/components/CatgorySelector.svelte'
	import type { JobWithID } from '$lib/types'

	let isLoading = $state<boolean>(false)
	let jobs = $state<JobWithID[]>([])
	let lastJob = $state<LastDocType>()
	let error = $state()

	const getJobs = async () => {
		try {
			isLoading = true
			const { jobs: data, lastDoc } = await getPublicJobs({
				lastVisibleDoc: undefined
			})
			jobs = data
			lastJob = lastDoc
			isLoading = false
		} catch (err) {
			error = err
		} finally {
			isLoading = false
		}
	}

	const handleLoadMoreJobs = async (lastVisibleDoc: JobWithID) => {
		console.log('load more...', { lastVisibleDoc })
		try {
			isLoading = true
			const { jobs: additionalJobs, lastDoc } = await getPublicJobs({
				lastVisibleDoc: lastVisibleDoc
			})
			lastJob = lastDoc
			jobs = [...jobs, ...additionalJobs]
			isLoading = false
		} catch (err) {
			error = err
		} finally {
			isLoading = false
		}
	}

	$effect(() => {
		getJobs()
	})

	/**
	 * Gets all public jobs. Takes advantage of "await" blocks from Svelte.
	 * https://svelte.dev/docs/svelte/await
	 */
	// let isGettingJobs = $state(getPublicJobs())
</script>

<SEO
	title={SITE_NAME}
	description="Browse current job openings in Hays, KS and surrounding communities. Post your job openings for free and generate more qualified job canidates."
/>

<!-- Hero -->
<div class="relative overflow-hidden">
	<div class="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 sm:py-24 lg:px-8">
		<div class="text-center">
			<h1 class="not-prose text-4xl font-bold sm:text-6xl dark:text-neutral-200">
				Current Job Openings
			</h1>

			<p class="not-prose mt-3 text-gray-600 dark:text-neutral-400">
				Browse current job openings in Hays, KS and surrounding communities. Are you an employer?
				Post your jobs for free, to get started, <a
					href="/register"
					class="not-prose text-blue-800 no-underline hover:underline">register here!</a
				>
			</p>

			<div class="relative mx-auto mt-4 max-w-xl sm:mt-12 sm:flex md:flex">
				<!-- Form -->
				<div class="flex flex-1 flex-col gap-2 sm:mt-0 sm:flex-row sm:items-center sm:justify-end">
					<div class=" hidden flex-1 space-y-3">
						<div>
							<div class="relative flex w-full flex-1">
								<input
									type="text"
									id="hs-leading-icon"
									name="hs-leading-icon"
									class="z-10 block flex-1 rounded-lg border-gray-200 p-4 ps-11 text-sm shadow-sm placeholder:text-gray-700 focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
									placeholder="Job title, Company, etc."
								/>
								<div
									class="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-4"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>
					<CatgorySelector />
				</div>
				<!-- End Form -->

				<!-- SVG Element -->
				<div class="absolute end-0 top-0 hidden -translate-y-12 translate-x-20 md:block">
					<svg
						class="h-auto w-16 text-orange-500"
						width="121"
						height="135"
						viewBox="0 0 121 135"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
							stroke="currentColor"
							stroke-width="10"
							stroke-linecap="round"
						/>
						<path
							d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
							stroke="currentColor"
							stroke-width="10"
							stroke-linecap="round"
						/>
						<path
							d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
							stroke="currentColor"
							stroke-width="10"
							stroke-linecap="round"
						/>
					</svg>
				</div>
				<!-- End SVG Element -->

				<!-- SVG Element -->
				<div class="absolute bottom-0 start-0 hidden -translate-x-32 translate-y-10 md:block">
					<svg
						class="h-auto w-40 text-blue-800"
						width="347"
						height="188"
						viewBox="0 0 347 188"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
							stroke="currentColor"
							stroke-width="7"
							stroke-linecap="round"
						/>
					</svg>
				</div>
				<!-- End SVG Element -->
			</div>
		</div>
	</div>
</div>
<!-- End Hero -->

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
		{#each jobs as job}
			<a class="group/item no-underline" href={`/jobs/${job.id}`}>
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
		{#if lastJob === 'LAST'}
			END OF JOBS
		{/if}
		{#if lastJob !== 'LAST'}
			<button onclick={() => handleLoadMoreJobs(lastJob!)}>Load More</button>
		{/if}
	</ul>
{/if}

{#if error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/if}
