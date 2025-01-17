import { collection, getDocs, doc, getDoc, query, where, documentId } from 'firebase/firestore'
import { db } from '$lib/firebase'
import { cachedData } from '$lib/cache.svelte'
import type { Job, JobWithID } from '$lib/types'

/**
 * Fetches public job listings from firebase
 */
export const getPublicJobs = async (): Promise<JobWithID[]> => {
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
		const querySnapshot = await getDocs(
			query(
				collection(db, 'jobs'),
				where('isDeleted', '==', false),
				where('status', '==', 'PUBLISHED')
			)
		)

		/**
		 * Map through results, and add "_id" with the document id as the value
		 * to each item. Not totally sure this is needed
		 */
		const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

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
 * Gets published jobs
 */
export const getPublicJob = async (jobId: string): Promise<Job> => {
	try {
		/**
		 * Check if job exists in cache
		 */

		const cachedJob = cachedData.jobs.find((job) => job.id === jobId)
		if (cachedJob) {
			console.log('Job found in cache, skipping fetch...')
			return cachedJob
		}

		console.log('Job not found in cache, fetching fresh data...')

		/**
		 * Reference to the document in the jobs collection
		 */
		// const docRef = doc(db, 'jobs', jobId)
		const querySnapshot = await getDocs(
			query(
				collection(db, 'jobs'),
				where(documentId(), '==', jobId),
				where('isDeleted', '==', false),
				where('status', '==', 'PUBLISHED')
			)
		)

		/**
		 * Map through results, and add "id" with the document id as the value
		 * to each item. Not totally sure this is needed
		 */
		const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0]

		/**
		 * Fetch the document
		 */
		// const docSnap = await getDoc(docRef)

		/**
		 * If the document exists, return the data
		 */
		if (data) {
			return data
		} else {
			throw new Error(`No such job with id: ${jobId}`)
		}
	} catch (error) {
		console.error('Error with getPublicJob', error)
		throw new Error('Error in getPublicJob')
	}
}
