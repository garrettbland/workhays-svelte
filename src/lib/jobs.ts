/**
 * Fetches public job listings from firebase
 */
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '$lib/firebase';

export const getPublicJobs = async (): Promise<any> => {
	try {
		const querySnapshot = await getDocs(collection(db, 'jobs'));
		const data = querySnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
		console.log({ data });
		return data;
	} catch (error) {
		console.error('Error fetching Firestore data:', error);
		throw new Error('Error fetching Firestore data');
	}
};

export const getPublicJob = async (jobId: string): Promise<any> => {
	try {
		// Reference the document
		const docRef = doc(db, 'jobs', jobId);

		// Fetch the document
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// Document data
			const data = docSnap.data();
			return data; // Pass data to your page
		} else {
			console.error('No such document!');
			throw new Error('No such document!');
		}
	} catch (error) {
		console.error('Error fetching Firestore job data:', error);
		throw new Error('Error fetching Firestore job data');
	}
};
