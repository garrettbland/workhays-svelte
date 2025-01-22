import admin from 'firebase-admin'
import serviceAccount from './service-account-key.json' with { type: 'json' }
import { FieldValue, Timestamp as FirebaseTimestamp } from 'firebase-admin/firestore'

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
})

export const firestore = admin.firestore()
export const auth = admin.auth()
export const serverTimestamp = () => FieldValue.serverTimestamp()
export const Timestamp = FirebaseTimestamp
