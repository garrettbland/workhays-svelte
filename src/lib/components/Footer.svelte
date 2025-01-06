<script lang="ts">
	import { page } from '$app/stores';
	import { SITE_NAME, FOOTER_LINKS } from '$lib/constants';
</script>

<!-- ========== FOOTER ========== -->
<footer class="mx-auto mt-16 w-full max-w-2xl px-4 sm:px-6 lg:px-8">
	<div class="border-t border-gray-200 py-6 dark:border-neutral-700">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<div>
				<p class="text-xs text-gray-600 dark:text-neutral-400">
					© {new Date().getFullYear()}
					{SITE_NAME}
				</p>
			</div>
			<!-- End Col -->

			<!-- List -->
			<ul class="flex flex-wrap items-center gap-3">
				{#each FOOTER_LINKS as link}
					<li class="text-xs dark:text-neutral-500 dark:before:bg-neutral-600">
						<a
							class="text-xs text-gray-500 underline hover:text-gray-800 hover:decoration-2 focus:decoration-2 focus:outline-none dark:text-neutral-500 dark:hover:text-neutral-400"
							href={link.href}
						>
							{link.name}
						</a>
					</li>
				{/each}
				<li class="hidden">
					<!-- Dark Mode -->
					<button
						type="button"
						class="hs-dark-mode relative flex size-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none hs-dark-mode-active:hidden dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
						data-hs-theme-click-value="dark"
					>
						<span class="sr-only">Dark</span>
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
							stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg
						>
					</button>
					<button
						type="button"
						class="hs-dark-mode relative flex hidden size-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none hs-dark-mode-active:flex dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
						data-hs-theme-click-value="light"
					>
						<span class="sr-only">Light</span>
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
							><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"
							></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"
							></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path
								d="m6.34 17.66-1.41 1.41"
							></path><path d="m19.07 4.93-1.41 1.41"></path></svg
						>
					</button>
					<!-- End Dark Mode -->
				</li>
			</ul>
			<!-- End List -->
		</div>
	</div>
</footer>
<!-- ========== END FOOTER ========== -->
