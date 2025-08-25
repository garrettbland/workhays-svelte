import { Timestamp } from 'firebase/firestore'

export const getHumanDateFromFirebaseTimestamp = (timestamp: Timestamp) => {
	// return timestamp.toDate().toLocaleDateString('en-US', {
	// 	dateStyle: 'medium', // 'short' | 'medium' | 'long' | 'full'
	// 	timeStyle: 'short' // or omit if you only want the date
	// })
	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'medium'
		// timeStyle: 'short'
	}).format(timestamp.toDate())
}

export const getTwoWeeksFromNow = (timestamp?: Date): Timestamp => {
	let now

	if (timestamp) {
		now = timestamp
	} else {
		now = Timestamp.now()
	}

	// Add 2 weeks (14 days)
	const twoWeeksFromNow = Timestamp.fromMillis(now.toMillis() + 14 * 24 * 60 * 60 * 1000)

	return twoWeeksFromNow
}

export const isJobExpired = (expiresAt: Timestamp): boolean => {
	// Check if the job's expiration date is in the past
	return expiresAt < Timestamp.now()
}
