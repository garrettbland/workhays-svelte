import {
	collection,
	getDocs,
	doc,
	getDoc,
	query,
	where,
	documentId,
	limit,
	startAfter,
	orderBy,
	QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from '$lib/firebase'
import { cachedData, allCachedJobs } from '$lib/cache.svelte'
import type { Job, JobWithID } from '$lib/types'
import type { DocumentData } from 'firebase-admin/firestore'

const DOC_LIMIT = 2

export type LastDocType = QueryDocumentSnapshot<DocumentData, DocumentData> | 'LAST'

/**
 * Fetches public job listings from firebase
 */
export const getPublicJobs = async ({
	lastVisibleDoc
}: {
	lastVisibleDoc?: JobWithID
}): Promise<{
	jobs: JobWithID[]
	lastDoc: LastDocType
}> => {
	try {
		/**
		 * Check if jobs exists in cache
		 * TEMP: disabling cache
		 */
		// if (lastVisibleDoc === undefined && cachedData.jobs.length > 0) {
		// 	console.log('Jobs exist in cache, skipping fetch...')
		// 	return cachedData.jobs
		// }

		console.log('Empty jobs cache, fetching fresh data...')

		let querySnapshot

		/**
		 * Get the docs from the jobs collection. If lastVisibleDoc is passed in,
		 * the "startAfter" cursor will be used
		 */
		if (lastVisibleDoc) {
			querySnapshot = await getDocs(
				query(
					collection(db, 'jobs'),
					where('isDeleted', '==', false),
					where('status', '==', 'PUBLISHED'),
					orderBy('updatedAt'),
					startAfter(lastVisibleDoc),
					limit(DOC_LIMIT)
				)
			)
		} else {
			querySnapshot = await getDocs(
				query(
					collection(db, 'jobs'),
					where('isDeleted', '==', false),
					where('status', '==', 'PUBLISHED'),
					orderBy('updatedAt'),
					limit(DOC_LIMIT)
				)
			)
		}

		/**
		 * Map through results, and add "id" with the document id as the value
		 * to each item. Not totally sure this is needed
		 */
		const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as JobWithID[]

		console.log('new jobs', { data })

		/**
		 * Update cached jobs
		 */
		cachedData.jobs = [...cachedData.jobs, ...data]

		return {
			jobs: data,
			lastDoc:
				querySnapshot.docs.length > 1 ? querySnapshot.docs[querySnapshot.docs.length - 1] : 'LAST'
		}
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

		const cachedJob = allCachedJobs().find((job) => job.id === jobId)
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

/**
 * Fetches public job listings from firebase
 */
export const getPublicJobsByIndustry = async (industry: string): Promise<JobWithID[]> => {
	try {
		const CACHED_KEY_NAME = industry.replace('-', '')

		/**
		 * Check if jobs exists in cache
		 */
		if (cachedData[CACHED_KEY_NAME] && cachedData[CACHED_KEY_NAME].length > 0) {
			console.log(`${industry} industry exist in cache, skipping fetch...`)
			return cachedData[CACHED_KEY_NAME]
		}

		console.log(`Empty industry ${industry} cache, fetching fresh data...`)

		/**
		 * Get the docs from the jobs collection with industry
		 */
		const querySnapshot = await getDocs(
			query(
				collection(db, 'jobs'),
				where('isDeleted', '==', false),
				where('status', '==', 'PUBLISHED'),
				where('industry', '==', industry)
			)
		)

		/**
		 * Map through results, and add "_id" with the document id as the value
		 * to each item. Not totally sure this is needed
		 */
		const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as JobWithID[]

		/**
		 * Update cached jobs
		 * Why does this cause infinite loops?
		 */
		console.log(`INDUSTYR`, CACHED_KEY_NAME)
		cachedData[CACHED_KEY_NAME] = data
		//cachedData[industry] = data

		return data
	} catch (error) {
		console.error('Error with getPublicJobs:', error)
		throw new Error('Error in getPublicJobs')
	}
}
