import { auth } from './firebase'
import {
	type User as FirebaseAuthUser,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	sendPasswordResetEmail
} from 'firebase/auth'
import type { UserWithID } from '$lib/types'
import { getUserByUid } from '$lib/users.admin'

/**
 * Universal state to store auth data.
 * https://svelte.dev/tutorial/svelte/universal-reactivity
 */
export const authData = $state<{
	auth: FirebaseAuthUser | null
	user: UserWithID | null
	isLoading: boolean
}>({
	auth: null,
	user: null,
	isLoading: true
})

/**
 * Listen for authentication changes
 */
onAuthStateChanged(auth, async (currentUser) => {
	try {
		console.log(`Authentication state changed, current user: ${currentUser}`)

		if (!currentUser || !currentUser.uid) {
			throw Error(`No current user or uid found`)
		}

		/**
		 * Get the users document from firestore
		 */
		const userRecord = await getUserByUid(currentUser?.uid)

		authData.auth = currentUser
		authData.user = userRecord
	} catch (err) {
		console.log(`Error in onAuthStateChanged`, err)
		authData.auth = null
		authData.user = null
	} finally {
		authData.isLoading = false
	}
})

/**
 * Sign in
 */
export const signIn = async (email: string, password: string) => {
	try {
		console.log('Starting sign in...')
		await signInWithEmailAndPassword(auth, email, password)
	} catch (error) {
		console.error('Login error:', error.message)
		throw error
	}
}

/**
 * Sign out
 */
export const signOut = async () => {
	try {
		console.log('Signing user out...')
		await firebaseSignOut(auth)
	} catch (error) {
		console.error('Logout error:', error.message)
		throw error
	}
}

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
	try {
		console.log('Starting password reset...')
		await sendPasswordResetEmail(auth, email)
	} catch (error) {
		console.error('Password reset error:', error.message)
		throw error
	}
}
