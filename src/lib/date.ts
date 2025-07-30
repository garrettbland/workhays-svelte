import { Timestamp } from 'firebase/firestore'

export const getHumanDateFromFirebaseTimestamp = (timestamp: Timestamp) => {
	console.log(timestamp.toDate())
	// return timestamp.toDate().toLocaleDateString('en-US', {
	// 	dateStyle: 'medium', // 'short' | 'medium' | 'long' | 'full'
	// 	timeStyle: 'short' // or omit if you only want the date
	// })
	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'medium'
		// timeStyle: 'short'
	}).format(timestamp.toDate())
}
