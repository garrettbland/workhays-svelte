import { auth } from './firebase'
import {
	type User as FirebaseAuthUser,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	sendPasswordResetEmail,
	updateEmail,
	reauthenticateWithCredential,
	EmailAuthProvider
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
		if (!currentUser || !currentUser.uid) {
			console.log(`No user currently logged in...`)
			throw Error(`No current user or uid found`)
		}

		console.log(`Fetch user info from db...`)

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
		// goto('/admin/dashboard')
	} catch (error) {
		console.error('Login error:', error)
		throw error
	}
}

/**
 * Sign out
 */
export const signOut = async () => {
	try {
		console.log(`Signing user out...`)
		await firebaseSignOut(auth)
	} catch (error) {
		console.error(`Logout error:`, error)
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
		console.error('Password reset error:', error)
		throw error
	}
}

/**
 * Change email
 */
export const changeEmail = async (currentEmail: string, newEmail: string, password: string) => {
	try {
		if (!auth.currentUser) {
			throw new Error(`User not valid.`)
		}

		console.log(`Starting change email...`)

		/**
		 * Make sure the user enters their password and re-authenticate
		 * to get a recent session. Also prevents account hijacking if a
		 * user left their computer open or whatever
		 */
		const currUser = await reauthenticateWithCredential(
			auth.currentUser,
			EmailAuthProvider.credential(currentEmail, password)
		)

		await updateEmail(currUser.user, newEmail)

		console.log(`Email Change complete...`)
	} catch (err) {
		console.error('Change email error:', err)
		throw new Error(`Error in changeEmail`)
	}
}
