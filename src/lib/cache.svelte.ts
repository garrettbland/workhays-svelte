import type { Job } from '$lib/types'

/**
 * Universal state to store cached data.
 * https://svelte.dev/tutorial/svelte/universal-reactivity
 *
 * Example usage...
 *
 * ```js
 * let jobs = $derived(cachedData.jobs);
 * console.log(jobs)
 * ```
 */
export const cachedData = $state<{ jobs: Job[] }>({ jobs: [] })
