import { query, collection, where, getDocs } from 'firebase/firestore'
import { db } from '$lib/firebase'
import type { User } from '$lib/types'

/**
 * Gets user record by uid
 */
export const getUserByUid = async (uid: string): Promise<User> => {
	try {
		console.log(`Starting query to find user document`)

		const querySnapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', uid)))

		if (!querySnapshot.empty) {
			const userDocument = querySnapshot.docs[0].data()
			console.log(`User document found`)
			return userDocument as User
		} else {
			throw new Error(`No matching user record found`)
		}
	} catch (error) {
		console.error('Error with getUserByUid', error)
		throw new Error('Error in getUserByUid')
	}
}
