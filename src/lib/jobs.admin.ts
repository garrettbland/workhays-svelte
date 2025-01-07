import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '$lib/firebase'

/**
 * Creates new job. Adds document to jobs collection in firestore
 */
export const createJob = async () => {
	try {
		console.log('Creating job...')
		return
	} catch (error) {
		console.error('Error with createJob:', error)
		throw new Error('Error in createJob')
	}
}
