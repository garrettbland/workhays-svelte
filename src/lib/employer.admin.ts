import {
	doc,
	getDoc,
	updateDoc,
	serverTimestamp,
	collection,
	addDoc,
	writeBatch
} from 'firebase/firestore'
import { db } from '$lib/firebase'
import type { Employer, EmployerWithID } from '$lib/types'
import { cachedAdminData, clearCachedData } from '$lib/cache.svelte'
import { getJobsByEmployerId } from './jobs.admin'

/**
 * Get employer by ID
 */
export const getEmployerById = async (employerId: string): Promise<EmployerWithID> => {
	try {
		/**
		 * Check if employer exists in cache
		 */
		if (cachedAdminData.employer?.id) {
			console.log(`📀 Employer exists in cache, skipping fetch...`)
			return cachedAdminData.employer
		}

		console.log(`📡 Empty employer cache, fetching fresh data...`)

		/**
		 * Reference to the document in the employers collection
		 */
		const docRef = doc(db, 'employers', employerId)

		/**
		 * Fetch the document
		 */
		const docSnap = await getDoc(docRef)

		/**
		 * If the document exists, return the data
		 */
		if (docSnap.exists()) {
			const data = docSnap.data()

			const docWithId = {
				...data,
				id: docSnap.id
			} as EmployerWithID

			/**
			 * Update cached employer
			 */
			cachedAdminData.employer = docWithId

			return docWithId
		} else {
			throw new Error(`❌ No such employer with id: ${employerId}`)
		}
	} catch (error) {
		console.error('Error with getEmployerById', error)
		throw new Error('Error in getEmployerById')
	}
}

/**
 * Updates employer by Id
 * TODO: Update jobs if employer title changes
 */
export const updateEmployerById = async (
	currentEmployer: EmployerWithID,
	updatedEmployerFields: Partial<EmployerWithID>
): Promise<{ status: 'SUCCESS' | 'ERROR' }> => {
	try {
		/**
		 * Create a batch to perform multiple writes as a single atomic operation
		 */
		const batch = writeBatch(db)

		/**
		 * Reference to the employer document in the employers collection
		 */
		const employerRef = doc(db, 'employers', currentEmployer.id)

		/**
		 * Remove "id" if present (since the type is EmployerWithID)
		 */
		delete updatedEmployerFields.id

		/**
		 * Add employer update to the batch
		 */
		batch.update(employerRef, {
			...updatedEmployerFields,
			updatedAt: serverTimestamp()
		})

		/**
		 * The title of the employer changed, meaning we have to go
		 * update each jobs "employer title" field
		 */
		if (currentEmployer.title !== updatedEmployerFields.title) {
			console.log(`ℹ️ Employer title has changed, updated existing jobs..`)

			const employersJobs = await getJobsByEmployerId(currentEmployer.id)

			/**
			 * Loop through and update each job with the new employer title
			 * and add to the batch (There is a limit of 500, but should be fine for now)
			 */
			employersJobs.forEach((job) => {
				const jobRef = doc(db, 'jobs', job.id)
				batch.update(jobRef, { employerTitle: updatedEmployerFields.title })
			})
		}

		await batch.commit()

		/**
		 * Reset cache
		 */
		cachedAdminData.employer = null

		return {
			status: 'SUCCESS'
		}
	} catch (error) {
		console.log(`Error with updateEmployerById`, error)
		return {
			status: 'ERROR'
		}
		throw new Error(`Error in updateEmployerById`)
	}
}

/**
 * Creates a new employer
 */
export const createEmployer = async (
	newEmployerData: Pick<
		Employer,
		'title' | 'description' | 'contact' | 'email' | 'phone' | 'website_url'
	>,
	userId: string
) => {
	try {
		console.log(`Creating new employer...`)

		/**
		 * Reference to the document in the employers collection as well as users
		 */
		const employersRef = collection(db, 'employers')
		// const usersRef = collection(db, 'users')

		const newEmployer: Employer = {
			...newEmployerData,
			status: 'PENDING', // New employers are pending until approved by an admin
			users: [{ role: 'ADMIN', status: 'ACCEPTED', userId }],
			updatedAt: serverTimestamp(),
			createdAt: serverTimestamp()
		}

		/**
		 * Create the new employer
		 */
		const docRef = await addDoc(employersRef, newEmployer)

		return {
			status: 'SUCCESS',
			employerId: docRef.id
		}
	} catch (error) {
		console.error('Error with createEmployer', error)
		return {
			status: 'ERROR',
			employerId: null
		}
	}
}
