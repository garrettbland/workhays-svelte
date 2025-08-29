<script lang="ts">
	import { getPublicJobs } from '$lib/jobs'
	import SEO from '$lib/components/SEO.svelte'
	import { INDUSTRIES, SITE_NAME } from '$lib/constants'
	import { page } from '$app/state'
	import CatgorySelector from '$lib/components/CatgorySelector.svelte'
	import type { Job, JobWithID } from '$lib/types'
	import { untrack } from 'svelte'
	import type { LastDocType } from '$lib/jobs'
	import Jobs from '$lib/components/Jobs.svelte'

	/**
	 * Gets all public jobs. Takes advantage of "await" blocks from Svelte.
	 * https://svelte.dev/docs/svelte/await
	 */
	// let category = $derived(page.params.category)
	//let isGettingJobs = $state(getPublicJobsByIndustry(category))

	let industry = $derived(page.params.industry)
	// let isGettingJobs = $state(false)
	// let jobs = $state<JobWithID[]>([])
	// let lastJob = $state<LastDocType>()
	// let error = $state()

	// const getJobs = async ({
	// 	industry,
	// 	lastSceneDoc
	// }: {
	// 	industry: INDUSTRIES
	// 	lastSceneDoc?: JobWithID
	// }) => {
	// 	try {
	// 		isGettingJobs = true
	// 		console.log('happening here...')
	// 		//jobs = new Promise((resolve) => resolve([]))

	// 		const data = await getPublicJobs({
	// 			industry: industry,
	// 			lastVisibleDoc: lastSceneDoc
	// 		})

	// 		jobs = data.jobs
	// 		lastJob = data.lastDoc
	// 	} catch (err) {
	// 		error = err
	// 	} finally {
	// 		isGettingJobs = false
	// 	}
	// }

	// $effect(() => {
	// 	if (category) {
	// 		untrack(() => {
	// 			getJobs(category)
	// 		})
	// 	}
	// })

	// $effect(() => {
	// 	try {
	// 		isGettingJobs = true
	// 		getPublicJobsByIndustry(page.params.category).then((data) => {
	// 			jobs = data
	// 		})
	// 	} catch (err) {
	// 		error = err
	// 	} finally {
	// 		{
	// 			isGettingJobs = false
	// 		}
	// 	}
	// })

	/**
	 * Job Category
	 */
	let industryName = $derived(Object.entries(INDUSTRIES).find((i) => i[1] === industry)[0])
</script>

<SEO
	title={SITE_NAME}
	description="Browse current job openings in Hays, KS and surrounding communities. Post your job openings for free and generate more qualified job canidates."
/>

<div class="prose prose-sm mb-12">
	<h1>
		Current Job Openings <br /><span class="font-normal text-gray-600">in {industryName}</span>
	</h1>
	<p class="not-prose mt-3 text-gray-600 dark:text-neutral-400">
		Browse current job openings in Hays, KS and surrounding communities. Are you an employer? Post
		your jobs for free, to get started, <a
			href="/register"
			class="not-prose text-blue-800 no-underline hover:underline">register here!</a
		>
	</p>
	<CatgorySelector />
</div>

{#key page.params.industry}
	<Jobs industry={page.params.industry} />
{/key}
