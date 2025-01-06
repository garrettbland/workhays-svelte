import { auth } from './firebase'
import {
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged
} from 'firebase/auth'

/**
 * Universal state to store auth data.
 * https://svelte.dev/tutorial/svelte/universal-reactivity
 */
export const authData = $state<{ user: Record<any, any> | null; isLoading: boolean }>({
	user: null,
	isLoading: true
})

/**
 * Listen for authentication changes
 */
onAuthStateChanged(auth, (currentUser) => {
	console.log(`Authentication state changed, current user: ${currentUser}`)
	authData.user = currentUser
	authData.isLoading = false
})

/**
 * Sign in
 */
export const signIn = async (email: string, password: string) => {
	try {
		console.log('Starting sign in...')
		await signInWithEmailAndPassword(auth, email, password)
		// return userCredential.user;
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
