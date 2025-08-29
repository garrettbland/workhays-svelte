<script lang="ts">
	// import { getPublicJobs } from '$lib/jobs'
	import type { LastDocType } from '$lib/jobs'
	import SEO from '$lib/components/SEO.svelte'
	import { SITE_NAME } from '$lib/constants'
	import CatgorySelector from '$lib/components/CatgorySelector.svelte'
	import type { JobWithID } from '$lib/types'
	import { page } from '$app/state'
	import Jobs from '$lib/components/Jobs.svelte'

	let industry = $derived(page.params.industry)

	// $effect(() => {
	// 	console.log('industry changed:', industry)
	// })

	// let isLoading = $state<boolean>(false)
	// let jobs = $state<JobWithID[]>([])
	// let lastJob = $state<LastDocType>()
	// let error = $state()

	// const getJobs = async () => {
	// 	try {
	// 		isLoading = true
	// 		const { jobs: data, lastDoc } = await getPublicJobs({
	// 			lastVisibleDoc: undefined
	// 		})
	// 		jobs = data
	// 		lastJob = lastDoc
	// 		isLoading = false
	// 	} catch (err) {
	// 		error = err
	// 	} finally {
	// 		isLoading = false
	// 	}
	// }

	// const handleLoadMoreJobs = async (lastVisibleDoc: JobWithID) => {
	// 	console.log('load more...', { lastVisibleDoc })
	// 	try {
	// 		isLoading = true
	// 		const { jobs: additionalJobs, lastDoc } = await getPublicJobs({
	// 			lastVisibleDoc: lastVisibleDoc
	// 		})
	// 		lastJob = lastDoc
	// 		jobs = [...jobs, ...additionalJobs]
	// 		isLoading = false
	// 	} catch (err) {
	// 		error = err
	// 	} finally {
	// 		isLoading = false
	// 	}
	// }

	// $effect(() => {
	// 	getJobs()
	// })

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

<div class="prose prose-sm mb-12">
	<h1>Current Job Openings</h1>
	<p class="not-prose mt-3 text-gray-600 dark:text-neutral-400">
		Browse current job openings in Hays, KS and surrounding communities. Are you an employer? Post
		your jobs for free, to get started, <a
			href="/register"
			class="not-prose text-blue-800 no-underline hover:underline">register here!</a
		>
	</p>
	<CatgorySelector />
</div>

<Jobs {industry} />
