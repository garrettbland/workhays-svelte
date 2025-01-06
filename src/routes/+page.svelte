<script>
	import { getPublicJobs } from '$lib/jobs';
	import SEO from '$lib/components/SEO.svelte';
	import { dataStore } from '$lib/stores/dataStore';
	import { get } from 'svelte/store';
  import { INDUSTRIES_LIST, SITE_NAME } from '$lib/constants';
	import { onMount } from 'svelte';

	let jobs = [];
	let error = null;

	onMount(async () => {
		// Check if data already exists in the store
		console.log('Mounted...');
		if (!get(dataStore)) {
			console.log('Fetching fresh data from server...');
			try {
				// const response = await fetch('https://jsonplaceholder.typicode.com/posts');
				// if (!response.ok) {
				// 	throw new Error('Failed to fetch data');
				// }
				// data = await response.json();

				const data = await getPublicJobs();

				dataStore.set(data); // Cache the data
			} catch (err) {
				error = err.message;
			}
		}

		// Subscribe to the store
		dataStore.subscribe((value) => {
			jobs = value;
		});
	});
</script>

<SEO
	title={SITE_NAME}
	description="Browse current job openings in Hays, KS and surrounding communities. Post your job openings for free and generate more qualified job canidates."
/>

<!-- Hero -->
<div class="relative overflow-hidden">
	<div class="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 sm:py-24 lg:px-8">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-gray-800 sm:text-6xl dark:text-neutral-200">
				Current Job Openings
			</h1>

			<p class="mt-3 text-gray-600 dark:text-neutral-400">
				Browse current job openings in Hays, KS and surrounding communities. Are you an employer?
				Post your jobs for free, to get started, <a href="/register" class="text-sky-600"
					>register here!</a
				>
			</p>

			<div class="relative mx-auto mt-4 max-w-xl sm:mt-12 sm:flex md:flex">
				<!-- Form -->
				<div class="flex flex-1 flex-col gap-2 sm:mt-0 sm:flex-row sm:items-center sm:justify-end">
					<div class=" flex-1 space-y-3">
						<div>
							<div class="relative flex w-full flex-1">
								<input
									type="text"
									id="hs-leading-icon"
									name="hs-leading-icon"
									class="z-10 block flex-1 rounded-lg border-gray-200 p-4 ps-11 text-sm shadow-sm placeholder:text-gray-700 focus:border-sky-600 focus:ring-sky-600 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
					<select
						class="z-10 flex-1 rounded-lg border-gray-200 p-4 text-sm focus:border-sky-600 focus:ring-sky-600 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
					>
						{#each INDUSTRIES_LIST as option}
							<option>
								{option.name}
							</option>
						{/each}
					</select>
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
						class="h-auto w-40 text-sky-600"
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

<p>Bunch of fake items from jsonplaceholder to test data fetching and preloading/etc...</p>
{#if error}
	<p>Error: {error}</p>
{:else if jobs.length === 0}
	<p>Loading...</p>
{:else}
	<ul class="list-inside list-none p-0">
		{#each data as item}
			<a class="group/item no-underline" href={`/jobs/${item.id}`}>
				<li
					class="flex w-full items-center gap-4 rounded-lg border border-gray-200 px-6 py-4 duration-300 ease-in-out hover:cursor-pointer hover:border-sky-600 hover:shadow-md hover:transition-all"
				>
					<div class="flex-1">
						<div class="text-sm font-normal text-gray-700">Employer Name</div>
						<div class="group/job text-lg font-bold group-hover/item:underline">
							{item.title}
						</div>
					</div>
					<div class="flex items-center gap-4">
						<div class="text-sm font-normal text-gray-700">Jan 1, 2025</div>
						<svg
							class="group/chevron size-4 shrink-0 group-hover/item:text-sky-600"
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
				</li></a
			>
{/if}
<!-- Pagination -->
<nav class="flex items-center justify-center gap-x-1" aria-label="Pagination">
	<button
		type="button"
		class="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 rounded-lg px-2.5 py-2 text-sm hover:bg-sky-100 focus:bg-sky-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
		aria-label="Previous"
		disabled=""
	>
		<svg
			class="size-3.5 shrink-0"
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
			<path d="m15 18-6-6 6-6"></path>
		</svg>
		<span>Previous</span>
	</button>
	<div class="flex items-center gap-x-1">
		<button
			type="button"
			class="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg bg-sky-100 px-3 py-2 text-sm focus:bg-sky-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-600 dark:text-white dark:focus:bg-neutral-500"
			aria-current="page">1</button
		>
		<button
			type="button"
			class="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg px-3 py-2 text-sm hover:bg-sky-50 focus:bg-sky-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
			>2</button
		>
		<button
			type="button"
			class="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg px-3 py-2 text-sm hover:bg-sky-50 focus:bg-sky-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
			>3</button
		>
	</div>
	<button
		type="button"
		class="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 rounded-lg px-2.5 py-2 text-sm hover:bg-sky-50 focus:bg-sky-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
		aria-label="Next"
	>
		<span>Next</span>
		<svg
			class="size-3.5 shrink-0"
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
	</button>
</nav>
<!-- End Pagination -->
