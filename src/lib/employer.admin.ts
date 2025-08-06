import { doc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore'
import { db } from '$lib/firebase'
import type { Employer, EmployerWithID } from '$lib/types'
import { cachedAdminData, clearCachedData } from '$lib/cache.svelte'

/**
 * Get employer by ID
 */
export const getEmployerById = async (employerId: string): Promise<EmployerWithID> => {
	try {
		console.log(`Getting employer with ID: `, employerId)

		/**
		 * Check if employer exists in cache
		 */
		if (cachedAdminData.employer) {
			console.log(`Employer exists in cache, skipping fetch`)
			return cachedAdminData.employer
		}

		console.log(`Empty employer cache, fetching fresh data...`)

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
			throw new Error(`No such employer with id: ${employerId}`)
		}
	} catch (error) {
		console.error('Error with getEmployerById', error)
		throw new Error('Error in getEmployerById')
	}
}

/**
 * Updates employer by Id
 */
export const updateEmployerById = async (
	employerId: string,
	updatedEmployer: Partial<EmployerWithID>
) => {
	try {
		/**
		 * Reference to the document in the employers collection
		 */
		// const docRef = doc(db, 'employers', employerId)
		const employersRef = collection(db, 'employers')

		/**
		 * Remove "id" if present
		 */
		delete updatedEmployer.id

		const newDoc = { ...updatedEmployer, updatedAt: serverTimestamp() }

		/**
		 * Update the document. Will not create new documents, just updates. If promise
		 * fufills, then success. The new doc is not returned
		 */
		await updateDoc(docRef, newDoc)

		/**
		 * Reset cache
		 */
		cachedAdminData.employer = null
	} catch (error) {
		console.log(`Error with updateEmployerById`, error)
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
