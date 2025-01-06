import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { writable } from 'svelte/store';

// Auth store
export const authState = writable({ user: null, loading: true });

// Listen for authentication changes
onAuthStateChanged(auth, (currentUser) => {
	console.log('auth state changed, current user...', currentUser);
	authState.set({ user: currentUser, loading: false });
});

// Sign-in function
export const login = async (email: string, password: string) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		return userCredential.user;
	} catch (error) {
		console.error('Login error:', error.message);
		throw error;
	}
};

// Sign-out function
export const logout = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.error('Logout error:', error.message);
		throw error;
	}
};
