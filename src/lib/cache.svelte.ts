import type { Job, EmployerWithID } from '$lib/types'

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

/**
 * Cached admin data for authenticated users
 */
export const cachedAdminData = $state<{
	employer: EmployerWithID | null
}>({ employer: null })
