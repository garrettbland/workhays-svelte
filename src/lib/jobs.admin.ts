import {
	query,
	collection,
	where,
	doc,
	getDocs,
	getDoc,
	updateDoc,
	serverTimestamp,
	addDoc
} from 'firebase/firestore'
import { db } from '$lib/firebase'
import type { Job, JobWithID, User } from '$lib/types'

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

		return docRef
	} catch (error) {
		console.error(`Error with createJob:`, error)
		throw new Error(`Error in createJob`)
	}
}

/**
 * Get jobs by employerId
 */
export const getJobsByEmployerId = async (employerId: string): Promise<JobWithID[]> => {
	try {
		console.log(`Starting query to find user document`)

		const querySnapshot = await getDocs(
			query(collection(db, 'jobs'), where('employerId', '==', employerId))
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

			/**
			 * If employer id was passed in, make sure the logged in
			 * user has access to this document
			 */
			if (employerId && employerId !== data.employerId) {
				throw new Error(`User not allowed to access document`)
			}

			return {
				...data,
				id: docSnap.id
			} as JobWithID
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
export const updateJobById = async (jobId: string, updatedJob: Partial<JobWithID>) => {
	try {
		/**
		 * Reference to the document in the jobs collection
		 */
		const docRef = doc(db, 'jobs', jobId)

		/**
		 * Remove "id" if present
		 */
		delete updatedJob.id

		/**
		 * Update the document. Will not create new documents, just updates. If promise
		 * fufills, then success. The new job doc is not returned
		 */
		await updateDoc(docRef, { ...updatedJob, updatedAt: serverTimestamp() })
	} catch (error) {
		console.log(`Error with updateJobById`, error)
		throw new Error(`Error in updateJobById`)
	}
}
