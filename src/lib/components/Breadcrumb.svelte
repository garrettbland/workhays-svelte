<script lang="ts">
	let {
		links
	}: {
		links: { href: string; label: string }[]
	} = $props()
</script>

<ol class="flex items-center whitespace-nowrap">
	{#each links as link, index}
		<li class="inline-flex items-center">
			{#if index === links.length - 1}
				<li
					class="inline-flex items-center truncate text-sm font-semibold text-gray-800 dark:text-neutral-200"
					aria-current="page"
				>
					{link.label}
				</li>
			{:else}
				<a
					class="focus:outline-hidden flex items-center text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
					href={link.href}
				>
					{link.label}
					<svg
						class="mx-2 size-4 shrink-0 text-gray-400 dark:text-neutral-600"
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
				</a>
			{/if}
		</li>
	{/each}
	<!-- <li class="inline-flex items-center">
		<a
			class="focus:outline-hidden flex items-center text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
			href="#"
		>
			Home
		</a>
		<svg
			class="mx-2 size-4 shrink-0 text-gray-400 dark:text-neutral-600"
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
	</li>
	<li class="inline-flex items-center">
		<a
			class="focus:outline-hidden flex items-center text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
			href="#"
		>
			App Center
			<svg
				class="mx-2 size-4 shrink-0 text-gray-400 dark:text-neutral-600"
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
		</a>
	</li>
	<li
		class="inline-flex items-center truncate text-sm font-semibold text-gray-800 dark:text-neutral-200"
		aria-current="page"
	>
		Application
	</li> -->
</ol>
