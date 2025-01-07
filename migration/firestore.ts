import admin from 'firebase-admin'
import serviceAccount from './path/to/your-service-account-key.json'

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
})

export const firestore = admin.firestore()
