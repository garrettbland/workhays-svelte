import {
	query,
	collection,
	where,
	getDocs,
	updateDoc,
	doc,
	serverTimestamp
} from 'firebase/firestore'
import { db } from '$lib/firebase'
import type { User, UserWithID } from '$lib/types'

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

			return {
				...userDocument,
				id: querySnapshot.docs[0].id
			} as UserWithID
		} else {
			throw new Error(`No matching user record found`)
		}
	} catch (error) {
		console.error('Error with getUserByUid', error)
		throw new Error('Error in getUserByUid')
	}
}

/**
 * Updates user by id
 */
export const updateUserById = async (userId: string, updatedUser: Partial<UserWithID>) => {
	try {
		/**
		 * Reference to the document in the employers collection
		 */
		const docRef = doc(db, 'users', userId)

		const updatedUserWithoutId = { ...updatedUser }

		/**
		 * Remove "id" if present
		 */
		delete updatedUserWithoutId.id

		/**
		 * Update the document. Will not create new documents, just updates. If promise
		 * fufills, then success. The new doc is not returned
		 */
		await updateDoc(docRef, { ...updatedUserWithoutId, updatedAt: serverTimestamp() })
	} catch (error) {
		console.log(`Error with updateUserById`, error)
		throw new Error(`Error in updateUserById`)
	}
}
