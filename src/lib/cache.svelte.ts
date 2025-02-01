import type { Job, JobWithID, EmployerWithID } from '$lib/types'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase-admin/firestore'

/**
 * Universal state to store cached jobs.
 * https://svelte.dev/tutorial/svelte/universal-reactivity
 *
 * Example usage...
 *
 * ```js
 * let jobs = $derived(cachedJobs);
 * console.log(jobs)
 * ```
 */
export const cachedJobs = $state<{ [id: string]: Job }>({})

/**
 * Return cached jobs. Otherwise svelte returns the Proxy object thing
 */
export const allCachedJobs = () => {
	return { ...cachedJobs }
}

/**
 * Clear all cached data
 */
export const clearCachedData = () => {
	Object.keys(cachedJobs).forEach((key) => delete cachedJobs[key])
}

/**
 * Cached admin data for authenticated users
 */
export const cachedAdminData = $state<{
	employer: EmployerWithID | null
}>({ employer: null })
