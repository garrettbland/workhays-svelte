import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '$lib/firebase'
import type { Employer, EmployerWithID } from '$lib/types'

/**
 * Get employer by ID
 */
export const getEmployerById = async (employerId: string): Promise<Employer> => {
	try {
		console.log(`Getting employer with ID: `, employerId)

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

			return {
				...data,
				id: docSnap.id
			} as EmployerWithID
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
		const docRef = doc(db, 'employers', employerId)

		/**
		 * Remove "id" if present
		 */
		delete updatedEmployer.id

		/**
		 * Update the document. Will not create new documents, just updates. If promise
		 * fufills, then success. The new doc is not returned
		 */
		await updateDoc(docRef, { ...updatedEmployer, updatedAt: serverTimestamp() })
	} catch (error) {
		console.log(`Error with updateEmployerById`, error)
		throw new Error(`Error in updateEmployerById`)
	}
}
