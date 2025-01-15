<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	let isModalOpen = $state(false)

	const setModal = (visibility: boolean) => {
		isModalOpen = visibility
	}
</script>

<!-- Trigger Button -->
<button
	type="button"
	class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
	onclick={() => setModal(true)}
>
	Open Modal
</button>

<!-- Modal -->
{#if isModalOpen}
	<div
		class="bg-blur-md fixed left-0 top-0 h-screen w-screen bg-black bg-opacity-50 backdrop-blur-sm"
		transition:fade={{ duration: 100 }}
		onclick={() => setModal(false)}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			transition:fly={{ y: -50, duration: 400 }}
			class="mx-auto mt-24 h-48 w-48 rounded bg-white p-4 shadow"
		>
			<div class="relative">
				<input
					type="password"
					class="peer block w-full rounded-lg border-transparent bg-gray-100 px-4 py-3 ps-11 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-transparent dark:bg-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
					placeholder="Enter password"
				/>
				<div
					class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 peer-disabled:pointer-events-none peer-disabled:opacity-50"
				>
					<svg
						class="size-4 shrink-0 text-gray-500 dark:text-neutral-500"
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
						<path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"></path>
						<circle cx="16.5" cy="7.5" r=".5"></circle>
					</svg>
				</div>
			</div>
		</div>
	</div>
{/if}
