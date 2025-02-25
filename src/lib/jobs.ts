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
	QueryDocumentSnapshot,
	QueryFieldFilterConstraint
} from 'firebase/firestore'
import { db } from '$lib/firebase'
import { cachedJobs, allCachedJobs } from '$lib/cache.svelte'
import type { Job, JobWithID } from '$lib/types'
import type { DocumentData } from 'firebase-admin/firestore'
import type { INDUSTRIES } from './constants'

const DOC_LIMIT = 2

export type CachedJobs = QueryDocumentSnapshot<DocumentData, DocumentData>[]

export type LastDocType = QueryDocumentSnapshot<DocumentData, DocumentData> | 'LAST'

/**
 * Testing out building queries conditionally
 */
const buildQuery = (queries: any[]) => {
	return queries
		.map((query) => {
			if (query) {
				if (typeof query === 'function') {
					return query()
				}
				return query
			}
		})
		.filter((i) => i !== undefined)

	return [where('isDeleted', '==', false), where('status', '==', 'PUBLISHED')]
}

/**
 * Fetches public job listings from firebase
 */
export const getPublicJobs = async ({
	industry,
	lastVisibleDoc
}: {
	industry?: INDUSTRIES
	lastVisibleDoc?: Job
}): Promise<{
	jobs: Record<string, Job>
	lastDoc: LastDocType
}> => {
	try {
		const CACHE_KEY_NAME = industry ? industry.replace('-', '') : 'all'

		/**
		 * Last visible doc was NOT passed in, and there are jobs in
		 * the cache
		 */
		if (!lastVisibleDoc && Object.keys(cachedJobs).length > 0) {
			console.log(`Jobs exist in cache, skipping fetch...`)
			return { jobs: cachedJobs, lastDoc: Object.values(cachedJobs).at(-1) }
		}

		/**
		 * Check if jobs exists in cache
		 */
		// if (cachedData[CACHE_KEY_NAME] && cachedData[CACHE_KEY_NAME].length > 0) {
		// 	console.log(`${CACHE_KEY_NAME} key exist in cache, skipping fetch...`)
		// 	return {
		// 		jobs: cachedData[CACHE_KEY_NAME].map((doc) => ({
		// 			...doc.data(),
		// 			id: doc.id
		// 		})) as JobWithID[],
		// 		lastDoc:
		// 			cachedData[CACHE_KEY_NAME].length > 1
		// 				? (cachedData[CACHE_KEY_NAME][cachedData[CACHE_KEY_NAME].length - 1] as any)
		// 				: 'LAST'
		// 	}
		// }

		// if (lastVisibleDoc === undefined && cachedData.jobs.length > 0) {
		// 	console.log('Jobs exist in cache, skipping fetch...')
		// 	return cachedData.jobs
		// }

		console.log(
			lastVisibleDoc ? `Loading additional jobs...` : `Fetching fresh jobs, none in cache...`
		)

		const querySnapshot = await getDocs(
			query(
				collection(db, 'jobs'),
				...buildQuery([
					where('isDeleted', '==', false),
					where('status', '==', 'PUBLISHED'),
					() => {
						if (industry) {
							return where('industry', '==', industry)
						}
					},
					orderBy('updatedAt'),
					() => {
						if (lastVisibleDoc) {
							return startAfter(lastVisibleDoc)
						}
					},
					limit(DOC_LIMIT)
				])
			)
		)

		const jobs: Record<string, Job> = {}

		querySnapshot.docs.map((doc) => {
			jobs[doc.id] = doc.data() as Job

			/**
			 * Cache the job
			 */
			cachedJobs[doc.id] = doc.data() as Job
		})
		;(window as any).cache = { ...window.cache, ...jobs }

		// cachedData[CACHE_KEY_NAME] = [
		// 	...(cachedData[CACHE_KEY_NAME] ? (cachedData[CACHE_KEY_NAME] as any) : []),
		// 	...querySnapshot.docs
		// ]

		/**
		 * Map through results, and add "id" with the document id as the value
		 * to each item. Not totally sure this is needed
		 */
		// const data = querySnapshot.docs.map((doc) => ({
		// 	...doc.data(),
		// 	id: doc.id
		// })) as JobWithID[]

		return {
			jobs,
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

		const cachedJob = allCachedJobs()[jobId]

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
		const data = querySnapshot.docs.map((doc) => ({ ...doc.data() }))[0] as Job

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
// export const getPublicJobsByIndustry = async (industry: string): Promise<JobWithID[]> => {
// 	try {
// 		const CACHED_KEY_NAME = industry.replace('-', '')

// 		/**
// 		 * Check if jobs exists in cache
// 		 */
// 		if (cachedData[CACHED_KEY_NAME] && cachedData[CACHED_KEY_NAME].length > 0) {
// 			console.log(`${industry} industry exist in cache, skipping fetch...`)
// 			return cachedData[CACHED_KEY_NAME]
// 		}

// 		console.log(`Empty industry ${industry} cache, fetching fresh data...`)

// 		/**
// 		 * Get the docs from the jobs collection with industry
// 		 */
// 		const querySnapshot = await getDocs(
// 			query(
// 				collection(db, 'jobs'),
// 				where('isDeleted', '==', false),
// 				where('status', '==', 'PUBLISHED'),
// 				where('industry', '==', industry)
// 			)
// 		)

// 		/**
// 		 * Map through results, and add "_id" with the document id as the value
// 		 * to each item. Not totally sure this is needed
// 		 */
// 		const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as JobWithID[]

// 		/**
// 		 * Update cached jobs
// 		 * Why does this cause infinite loops?
// 		 */
// 		console.log(`INDUSTYR`, CACHED_KEY_NAME)
// 		cachedData[CACHED_KEY_NAME] = data
// 		//cachedData[industry] = data

// 		return data
// 	} catch (error) {
// 		console.error('Error with getPublicJobs:', error)
// 		throw new Error('Error in getPublicJobs')
// 	}
// }
