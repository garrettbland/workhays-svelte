import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '$lib/firebase'
import { cachedData } from '$lib/cache.svelte'
import type { Job } from '$lib/types'

/**
 * Fetches public job listings from firebase
 * TO DO: Only show "PUBLISHED"
 */
export const getPublicJobs = async (): Promise<Job[]> => {
	try {
		/**
		 * Check if jobs exists in cache
		 */
		if (cachedData.jobs.length > 0) {
			console.log('Jobs exist in cache, skipping fetch...')
			return cachedData.jobs
		}

		console.log('Empty jobs cache, fetching fresh data...')

		/**
		 * Get the docs from the jobs collection
		 */
		const querySnapshot = await getDocs(collection(db, 'jobs'))

		/**
		 * Map through results, and add "_id" with the document id as the value
		 * to each item. Not totally sure this is needed
		 */
		const data = querySnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }))

		/**
		 * Update cached jobs
		 */
		cachedData.jobs = data

		return data
	} catch (error) {
		console.error('Error with getPublicJobs:', error)
		throw new Error('Error in getPublicJobs')
	}
}

/**
 * TO DO: Only show "PUBLISHED"
 */
export const getPublicJob = async (jobId: string): Promise<Job> => {
	try {
		/**
		 * Check if job exists in cache
		 */

		const cachedJob = cachedData.jobs.find((job) => job._id === jobId)
		if (cachedJob) {
			console.log('Job found in cache, skipping fetch...')
			return cachedJob
		}

		console.log('Job not found in cache, fetching fresh data...')

		/**
		 * Reference to the document in the jobs collection
		 */
		const docRef = doc(db, 'jobs', jobId)

		/**
		 * Fetch the document
		 */
		const docSnap = await getDoc(docRef)

		/**
		 * If the document exists, return the data
		 */
		if (docSnap.exists()) {
			const data = docSnap.data()
			return data
		} else {
			throw new Error(`No such job with id: ${jobId}`)
		}
	} catch (error) {
		console.error('Error with getPublicJob', error)
		throw new Error('Error in getPublicJob')
	}
}
