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
	QueryFieldFilterConstraint,
	Timestamp
} from 'firebase/firestore'
import { db } from '$lib/firebase'
import { cachedJobs, allCachedJobs, miscStorage } from '$lib/cache.svelte'
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
	lastVisibleDoc?: LastDocType
}): Promise<{
	jobs: Record<string, Job>
	// lastDoc: LastDocType // this is now stored in miscStorage in this file
}> => {
	try {
		// const LAST_VISIBLE_DOC = miscStorage.lastSeenDoc

		console.log(`args:`, { industry, lastVisibleDoc: lastVisibleDoc })

		const CACHE_KEY_NAME = industry ? industry.replace('-', '') : 'all'

		const CACHE_EXISTS = Object.keys(cachedJobs).length > 0

		if (CACHE_EXISTS) {
			/**
			 * Some sort of cache exists.
			 */
			if (lastVisibleDoc === 'LAST') {
				console.log(`📀 Reached the end of jobs, no more to load...`)
				return {
					jobs: cachedJobs
				}
			} else if (lastVisibleDoc) {
				console.log(`ℹ️ Some jobs exists, but fetching more...`)
			} else {
				console.log(`📀 Jobs exist in cache, skipping fetch...`)
				return {
					jobs: cachedJobs
				}
			}
		}

		/**
		 * Last visible doc was NOT passed in, and there are jobs in
		 * the cache. We skip returning the cache only here because
		 * if the lastVisibleDoc is passed in, we are paginating and
		 * need to fetch more jobs from the database.
		 */
		// if (!LAST_VISIBLE_DOC && CACHE_EXISTS) {
		// 	console.log(`📀 Jobs exist in cache, skipping fetch...`)
		// 	return { jobs: cachedJobs } //  lastDoc: Object.values(cachedJobs).at(-1)
		// }

		// if (LAST_VISIBLE_DOC === 'LAST') {
		// 	console.log(`🚩 Reached the end of jobs, no more to load...`)
		// 	return { jobs: cachedJobs }
		// }

		// if (LAST_VISIBLE_DOC && CACHE_EXISTS) {
		// 	console.log(`📀 Some jobs exists, but fetching more...`)
		// }

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

		console.log(`📡 Fetching ${CACHE_EXISTS ? `additional` : `new`} jobs from database...`)

		// console.log(
		// 	lastVisibleDoc ? `Loading additional jobs...` : `Fetching fresh jobs, none in cache...`
		// )

		const querySnapshot = await getDocs(
			query(
				collection(db, 'jobs'),
				...buildQuery([
					where('isDeleted', '==', false),
					where('status', '==', 'PUBLISHED'),
					where('expiresAt', '>', Timestamp.now()),
					() => {
						if (industry) {
							return where('industry', '==', industry)
						}
					},
					orderBy('sortId', 'desc'),
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

		console.log(`ℹ️ Fetched ${querySnapshot.docs.length} jobs from database`)

		querySnapshot.docs.map((doc) => {
			jobs[doc.id] = doc.data() as Job

			/**
			 * Cache the job
			 */
			cachedJobs[doc.id] = doc.data() as Job
		})

		const LAST_DOC =
			querySnapshot.docs.length > 1 ? querySnapshot.docs[querySnapshot.docs.length - 1] : 'LAST'

		/**
		 * Update last seen doc in misc storage
		 */
		miscStorage.lastSeenDoc = LAST_DOC

		/**
		 * Store on window for debugging
		 */
		window.cache = { ...cachedJobs, ...miscStorage }

		if (querySnapshot.docs.length < DOC_LIMIT) {
			console.log(`🚩 Reached the end of jobs...`)
		}

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
			jobs
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

		let job: Job

		const docRef = doc(db, 'jobs', jobId)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			job = docSnap.data() as Job
		} else {
			console.log('No such document!')
			throw new Error(`No such job with id: ${jobId}`)
		}

		// const docRef = doc(db, 'jobs', jobId)
		// const querySnapshot = await getDocs(
		// 	query(
		// 		collection(db, 'jobs'),
		// 		where(documentId(), '==', jobId),
		// 		where('isDeleted', '==', false),
		// 		where('status', '==', 'PUBLISHED')
		// 		// where('expiresAt', '>', Timestamp.now()) // Ensure job is not expired
		// 	)
		// )

		/**
		 * Map through results, and add "id" with the document id as the value
		 * to each item. Not totally sure this is needed
		 */
		// const job = querySnapshot.docs.map((doc) => ({ ...doc.job() }))[0] as Job

		/**
		 * Fetch the document
		 */
		// const docSnap = await getDoc(docRef)
		if (job.expiresAt < Timestamp.now()) {
			throw new Error('Job expired...')
		}

		return job
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
