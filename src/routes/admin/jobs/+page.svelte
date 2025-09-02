<script lang="ts">
	import { authData } from '$lib/auth.svelte'
	import { getJobsByEmployerId } from '$lib/jobs.admin'
	import { page } from '$app/state'
	import Alert from '$lib/components/Alert.svelte'
	import Link from '$lib/components/Link.svelte'
	import { getHumanDateFromFirebaseTimestamp, isJobExpired } from '$lib/date'
	import Loader from '$lib/components/Loader.svelte'
	import type { JobWithID } from '$lib/types'

	/**
	 * Gets all public jobs. Takes advantage of "await" blocks from Svelte.
	 * https://svelte.dev/docs/svelte/await
	 */
	let isGettingJobs = $state(getJobsByEmployerId(authData?.user?.memberOf[0] ?? ''))

	let wasJobDeleted = $derived(page.url.searchParams.has('jobDeleted'))
	let newJobId = $derived(page.url.searchParams.get('newJobId'))

	/**
	 * Helper util for getting job status and to display it nicely
	 */
	const formatJobStatus = (job: JobWithID) => {
		if (job.status === 'DRAFT') {
			return 'Draft'
		} else if (isJobExpired(job.expiresAt)) {
			return 'Expired'
		} else {
			return 'Active'
		}
	}
</script>

<div class="prose prose-sm mb-4">
	<h1>Jobs</h1>
</div>

{#if wasJobDeleted}
	<Alert title="Success - Your job has been deleted" type="success" />
{/if}

{#await isGettingJobs}
	<Loader />
{:then jobs}
	{#if newJobId && jobs.find((i) => i.id === newJobId)}
		<Alert
			title={`Success - Your new job, ${jobs.find((i) => i.id === newJobId)?.title}, has been created.`}
			type="success"
		/>
	{/if}

	<div class="mb-6 flex flex-col">
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
									>Status</th
								>
								<th scope="col" class="py-3 text-end text-xs font-medium text-gray-500 uppercase"
									>Expires</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each Object.entries(jobs) as [id, job]}
								<tr class="grid grid-cols-3 hover:bg-gray-50">
									<td class="truncate text-start text-sm whitespace-nowrap text-gray-800"
										><a href={`/admin/jobs/edit/${job.id}`} class="block py-4 pl-6">{job.title}</a
										></td
									>
									<td class="truncate text-sm whitespace-nowrap text-gray-800"
										><a href={`/admin/jobs/edit/${job.id}`} class="block py-4 pl-2"
											>{formatJobStatus(job)}</a
										></td
									>

									<td class=" text-end text-sm whitespace-nowrap text-gray-800"
										><a href={`/admin/jobs/edit/${job.id}`} class="block py-4 pr-6"
											>{getHumanDateFromFirebaseTimestamp(job.expiresAt)}</a
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
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong getting jobs: {error.message}</p>
{/await}

<Link type="primary" href="/admin/jobs/new" title="Create New Job" />
