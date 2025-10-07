<script lang="ts">
	import type { Job } from '$lib/types'
	import type { PageData } from './$types'
	import { generateHTML } from '@tiptap/core'
	import StarterKit from '@tiptap/starter-kit'
	import Underline from '@tiptap/extension-underline'
	import Link from '@tiptap/extension-link'
	import { INDUSTRIES, JOB_TYPES } from '$lib/constants'
	import { getHumanDateFromFirebaseTimestamp } from '$lib/date'
	import Breadcrumb from '$lib/components/Breadcrumb.svelte'
	import Loader from '$lib/components/Loader.svelte'

	let { data }: { data: PageData } = $props()
	const job: Job = data

	let loading = $state(true)
	let htmlDescription = $state('')

	/**
	 * Labels for job types. Basically reverses the JOB_TYPES object
	 * to map values to labels for display purposes.
	 */
	const JOB_TYPE_LABELS = Object.fromEntries(
		Object.entries(JOB_TYPES).map(([label, value]) => [value, label])
	)

	const INDUSTRY_TYPE_LABELS = Object.fromEntries(
		Object.entries(INDUSTRIES).map(([label, value]) => [value, label])
	)

	$effect(() => {
		if (data) {
			loading = false
		}
	})

	$effect(() => {
		if (job.description) {
			htmlDescription = generateHTML(job.description, [StarterKit, Underline, Link])
		}
	})
</script>

<div class="h-6"></div>
<Breadcrumb
	links={[
		{
			href: '/',
			label: 'Home'
		},
		{ href: '', label: job.title }
	]}
/>
<div class="h-6"></div>

{#if loading}
	<Loader />
{:else}
	<div class="lg:flex lg:items-center lg:justify-between">
		<div class="flex-1">
			<h2 class="not-prose text-2xl font-bold sm:truncate">{job.title}</h2>
			<div class="mb-2">
				<!-- <a href="#" class="not-prose text-blue-800 no-underline hover:underline"
					>{job.employerTitle}</a
				> -->
				Apply for the position, {job.title}, with {job.employerTitle} today. Last updated on {getHumanDateFromFirebaseTimestamp(
					job.updatedAt
				)}
			</div>
			<!-- <div
				class="flex flex-col gap-2 border-b border-t border-gray-200 py-2 sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6"
			>
				<div class="flex items-center text-sm font-medium">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mr-1.5 size-5 shrink-0 text-gray-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
						/>
					</svg>
					{JOB_TYPE_LABELS[job.type]}
				</div>
				<div class=" flex items-center text-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mr-1.5 size-5 shrink-0 text-gray-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
						/>
					</svg>
					<a class="not-prose text-blue-800 no-underline hover:underline" href={job.applicationLink}
						>Apply Online</a
					>
				</div>
				<div class=" flex items-center text-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mr-1.5 size-5 shrink-0 text-gray-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
						/>
					</svg>
					<a
						class="not-prose text-blue-800 no-underline hover:underline"
						href="mailto:email@example.com">Contact</a
					>
				</div>
				<div class=" flex items-center text-sm font-medium">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mr-1.5 size-5 shrink-0 text-gray-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
						/>
					</svg>
					<a class="not-prose text-blue-800 no-underline hover:underline" href="tel:555-555-5555"
						>555-555-5555</a
					>
				</div>
				<div class=" flex items-center text-sm font-medium">
					<svg
						class="-ml-0.5 mr-1.5 size-5 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z"
						/>
						<path
							d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z"
						/>
					</svg>
					<a class="not-prose text-blue-800 no-underline hover:underline" href="#">Copy Link</a>
				</div>
			</div> -->
		</div>
	</div>
	<div class="mx-auto my-8 max-w-4xl lg:px-0">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-6">
			<div class="col-span-1 mb-12 md:col-span-4 md:mb-0 md:pr-4">
				<article class="prose">
					{@html htmlDescription}
				</article>
			</div>
			<div class="col-span-1 md:col-span-2">
				<div class="rounded-lg border border-gray-200 bg-white p-2">
					<div class="mb-6">
						<h4 class="not-prose text-sm font-bold">Type</h4>
						<div class="mt-1 text-sm">{JOB_TYPE_LABELS[job.type]}</div>
					</div>
					<div class="mb-6">
						<h4 class="not-prose text-sm font-bold">Industry</h4>
						<div class="mt-1 text-sm">{INDUSTRY_TYPE_LABELS[job.industry]}</div>
					</div>
					<div class="mb-6">
						<h4 class="not-prose text-sm font-bold">Last Updated</h4>
						<div class="mt-1 text-sm">{getHumanDateFromFirebaseTimestamp(job.updatedAt)}</div>
					</div>
					<div class="mb-6">
						<h4 class="not-prose text-sm font-bold">Employer</h4>
						<div class="mt-1 text-sm">
							<div class="mt-1 text-sm">
								<a class="text-blue-700 hover:underline" href={`/employers/${job.employerId}`}
									>{job.employerTitle}</a
								>
							</div>
						</div>
					</div>
					{#if job.applicationLink}
						<div class="mb-6">
							<h4 class="not-prose text-sm font-bold">Apply Online</h4>
							<div class="mt-1 text-sm">
								<a class="text-blue-600 hover:underline" target="_blank" href={job.applicationLink}
									>Click here to apply</a
								>
							</div>
						</div>
					{/if}
					<!-- <div class="">
						<h4 class="not-prose text-sm font-bold">Last Updated</h4>
						<div class="mt-1 text-sm leading-5">{job.updatedAt}</div>
					</div> -->
				</div>
			</div>
		</div>
	</div>
{/if}
