import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration object
const firebaseConfig = {
	apiKey: 'AIzaSyDcBWMmheioVRfD6qUlz9FL26HHLsSNDfI',
	authDomain: 'workhays-firebase.firebaseapp.com',
	databaseURL: 'https://workhays-firebase.firebaseio.com',
	projectId: 'workhays-firebase',
	storageBucket: 'workhays-firebase.appspot.com',
	messagingSenderId: '154850091334',
	appId: '1:154850091334:web:d04f857e51be6be36fc547'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
