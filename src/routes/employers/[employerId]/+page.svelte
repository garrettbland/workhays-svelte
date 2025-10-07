<script lang="ts">
	import type { Employer, EmployerWithID } from '$lib/types'
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
	const employer: EmployerWithID = data

	let loading = $state(true)
	let htmlDescription = $state('')

	/**
	 * Labels for job types. Basically reverses the JOB_TYPES object
	 * to map values to labels for display purposes.
	 */
	// const JOB_TYPE_LABELS = Object.fromEntries(
	// 	Object.entries(JOB_TYPES).map(([label, value]) => [value, label])
	// )

	// const INDUSTRY_TYPE_LABELS = Object.fromEntries(
	// 	Object.entries(INDUSTRIES).map(([label, value]) => [value, label])
	// )

	$effect(() => {
		if (data) {
			loading = false
		}
	})

	$effect(() => {
		if (employer.description) {
			htmlDescription = generateHTML(employer.description, [StarterKit, Underline, Link])
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
		{ href: '', label: employer.title }
	]}
/>
<div class="h-6"></div>

{#if loading}
	<Loader />
{:else}
	<div class="lg:flex lg:items-center lg:justify-between">
		<div class="flex-1">
			<h2 class="not-prose text-2xl font-bold sm:truncate">{employer.title}</h2>
			<div class="mb-6">
				Learn more about {employer.title}, visit their website, or contact them today.
			</div>
			<div
				class="mb-6 mb-6 grid grid-cols-1 gap-6 rounded-md border border-gray-200 p-4 md:grid-cols-4"
			>
				<div class="grid grid-flow-row">
					<div class="text-sm text-gray-800">Employer Contact</div>
					<div class="truncate font-semibold">{employer.contact}</div>
				</div>
				<div class="grid grid-flow-row">
					<div class="text-sm text-gray-800">Phone</div>
					<a
						href={`tel:${employer.phone}`}
						class="truncate font-semibold text-blue-700 hover:underline">{employer.phone}</a
					>
				</div>
				<div class="grid grid-flow-row">
					<div class="text-sm text-gray-800">Email</div>
					<a
						href={`mailto:${employer.email}`}
						class="truncate font-semibold text-blue-700 hover:underline">{employer.email}</a
					>
				</div>
				<div class="grid grid-flow-row">
					<div class="text-sm text-gray-800">Website</div>
					{#if employer.website_url}
						<a
							href={employer.website_url}
							target="_blank"
							class="truncate font-semibold text-blue-700 hover:underline">{employer.website_url}</a
						>
					{:else}
						<span class="truncate font-semibold text-gray-400">N/A</span>
					{/if}
				</div>
			</div>

			<div class="col-span-1 mt-4 mb-12 md:col-span-4 md:mb-0 md:pr-4">
				<article class="prose">
					{@html htmlDescription}
				</article>
			</div>
		</div>
	</div>
{/if}
