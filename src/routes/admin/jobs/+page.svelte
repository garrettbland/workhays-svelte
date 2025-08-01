<script lang="ts">
	import { authData } from '$lib/auth.svelte'
	import { getJobsByEmployerId } from '$lib/jobs.admin'
	import { page } from '$app/state'
	import Alert from '$lib/components/Alert.svelte'
	import Link from '$lib/components/Link.svelte'
	import { getHumanDateFromFirebaseTimestamp, isJobExpired } from '$lib/date'

	/**
	 * Gets all public jobs. Takes advantage of "await" blocks from Svelte.
	 * https://svelte.dev/docs/svelte/await
	 */
	let isGettingJobs = $state(getJobsByEmployerId(authData.user?.memberOf[0] ?? ''))

	let wasJobDeleted = $derived(page.url.searchParams.has('jobDeleted'))
	let newJobId = $derived(page.url.searchParams.get('newJobId'))
</script>

<div class="prose prose-sm mb-4">
	<h1>Jobs</h1>
</div>

{#if wasJobDeleted}
	<Alert title="Success - Your job has been updated" type="success" />
{/if}

{#await isGettingJobs}
	<div class="mb-4">
		<Alert type="secondary" title="Loading..." />
	</div>
{:then jobs}
	{#if newJobId && jobs.find((i) => i.id === newJobId)}
		<Alert
			title={`Success - Your new job, ${jobs.find((i) => i.id === newJobId)?.title}, has been created.`}
			type="success"
		/>
	{/if}

	<ul class="my-4 space-y-2">
		{#each jobs as job}
			<li class="rounded-md border border-gray-200 hover:bg-gray-50">
				<a href={`/admin/jobs/edit/${job.id}`} class="block p-4 font-semibold"
					>{job.title}
					{#if isJobExpired(job.expiresAt)}
						<span class="rounded-full bg-orange-200 px-2 py-1 text-sm text-orange-900">Expired</span
						>
					{/if}

					<span class="block text-sm font-normal text-gray-800">
						Expires: {job.expiresAt ? getHumanDateFromFirebaseTimestamp(job.expiresAt) : 'na'}
					</span>
				</a>
			</li>
		{/each}
	</ul>
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong getting jobs: {error.message}</p>
{/await}

<Link type="primary" href="/admin/jobs/new" title="Create New Job" />
