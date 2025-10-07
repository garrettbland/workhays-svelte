import { doc, getDoc } from 'firebase/firestore'
import { db } from '$lib/firebase'
import type { EmployerWithID } from '$lib/types'
import { cachedAdminData } from '$lib/cache.svelte'
// import { getJobsByEmployerId } from './jobs.admin'

/**
 * Get approved public employer by ID
 */
export const getPublicEmployerById = async (employerId: string): Promise<EmployerWithID> => {
	try {
		/**
		 * Check if employer exists in cache
		 */
		if (cachedAdminData.employer?.id && cachedAdminData.employer.status === 'APPROVED') {
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

			if (data.status !== 'APPROVED') {
				throw new Error(`❌ Employer with id: ${employerId} is not approved`)
			}

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
			throw new Error(`❌ No found employer with id: ${employerId}`)
		}
	} catch (error) {
		console.error('Error with getPublicEmployerById', error)
		throw new Error('Error in getPublicEmployerById')
	}
}
