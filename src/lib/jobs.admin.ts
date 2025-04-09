import {
	query,
	collection,
	where,
	doc,
	getDocs,
	getDoc,
	documentId,
	updateDoc,
	serverTimestamp,
	addDoc
} from 'firebase/firestore'
import { db } from '$lib/firebase'
import type { Job, JobWithID, User } from '$lib/types'
import { clearCachedData } from './cache.svelte'

/**
 * Creates new job. Adds document to jobs collection in firestore
 */

export const createJob = async (
	newJob: Omit<Job, 'updatedAt' | 'createdAt'>,
	employerId: string,
	employerTitle: string
) => {
	try {
		console.log(`Creating job...`)

		const jobsRef = collection(db, 'jobs')

		const docRef = await addDoc(jobsRef, {
			...newJob,
			employerId,
			employerTitle,
			updatedAt: serverTimestamp(),
			createdAt: serverTimestamp()
		})

		clearCachedData()

		return docRef
	} catch (error) {
		console.error(`Error with createJob:`, error)
		throw new Error(`Error in createJob`)
	}
}

/**
 * Get jobs by employerId
 */
export const getJobsByEmployerId = async (
	employerId: string,
	includeDeleted = false
): Promise<JobWithID[]> => {
	try {
		console.log(`Starting query to find user document`)

		const querySnapshot = await getDocs(
			query(
				collection(db, 'jobs'),
				where('employerId', '==', employerId),
				where('isDeleted', '==', includeDeleted)
			)
		)

		if (!querySnapshot.empty) {
			const userDocuments = querySnapshot.docs
			return userDocuments.map(
				(doc) =>
					({
						...doc.data(),
						id: doc.id
					}) as JobWithID
			)
		} else {
			console.log(`No jobs found for employer`)
			return []
		}
	} catch (error) {
		console.error('Error with getUserByUid', error)
		throw new Error('Error in getUserByUid')
	}
}

/**
 * Get job by id regardless of status. If a employer id passed in, the job
 * will only be accessible if the jobs "employerId" matches the logged in
 * users
 */
export const getJobById = async (jobId: string, employerId?: string): Promise<JobWithID> => {
	try {
		/**
		 * Reference to the document in the jobs collection
		 */
		// const docRef = doc(db, 'jobs', jobId)
		const querySnapshot = await getDocs(
			query(
				collection(db, 'jobs'),
				where(documentId(), '==', jobId),
				where('isDeleted', '==', false)
			)
		)

		/**
		 * Map through results, and add "id" with the document id as the value
		 * to each item. Not totally sure this is needed
		 */
		const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0]

		/**
		 * If the document exists, return the data
		 */
		if (data) {
			/**
			 * If employer id was passed in, make sure the logged in
			 * user has access to this document
			 */
			if (employerId && employerId !== data.employerId) {
				throw new Error(`User not allowed to access document`)
			}

			return data as JobWithID
		} else {
			throw new Error(`No such job with id: ${jobId}`)
		}
	} catch (error) {
		console.error('Error with getJobById', error)
		throw new Error('Error in getJobById')
	}
}

/**
 * Updates job by id
 */
export const updateJobById = async (
	jobId: string,
	updatedJob: Partial<JobWithID>
): {
	status: 'success' | 'error'
} => {
	try {
		/**
		 * Reference to the document in the jobs collection
		 */
		const docRef = doc(db, 'jobs', jobId)

		const updatedDocWithoutId = { ...updatedJob }

		/**
		 * Remove "id" if present
		 */
		delete updatedDocWithoutId.id

		/**
		 * Update the document. Will not create new documents, just updates. If promise
		 * fufills, then success. The new job doc is not returned
		 */
		await updateDoc(docRef, { ...updatedJob, updatedAt: serverTimestamp() })

		clearCachedData()

		return {
			status: 'success'
		}
	} catch (error) {
		console.error(`Error with updateJobById`, error)
		return {
			status: 'error'
		}
		// throw new Error(`Error in updateJobById`)
	}
}

/**
 * Deletes job. Sets "isDeleted" flag to "true". This is a soft delete, record
 * will stay in database
 */
export const softDeleteJobById = async (jobId: string) => {
	try {
		/**
		 * Reference to the document in the jobs collection
		 */
		const docRef = doc(db, 'jobs', jobId)

		/**
		 * Update the document
		 */
		await updateDoc(docRef, { isDeleted: true, deletedAt: serverTimestamp() })

		clearCachedData()
	} catch (err) {
		console.log(`Error with softDeleteJobById`, err)
		throw new Error(`Error in softDeleteJobById`)
	}
}
