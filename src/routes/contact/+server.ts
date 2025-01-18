import { json } from '@sveltejs/kit'
import admin from 'firebase-admin'
const serverTimestamp = () => FieldValue.serverTimestamp()
import { getApps } from 'firebase-admin/app'
import { FieldValue } from 'firebase-admin/firestore'
import { PROJECT_ID, PRIVATE_KEY, CLIENT_EMAIL } from '$env/static/private'

const serviceAccount: admin.ServiceAccount = {
	privateKey: PRIVATE_KEY,
	projectId: PROJECT_ID,
	clientEmail: CLIENT_EMAIL
}

const currentApps = getApps()
let firebaseAdmin

if (currentApps.length === 0) {
	firebaseAdmin = admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	})
} else {
	firebaseAdmin = admin.app()
}

const firestore = firebaseAdmin.firestore()

export const POST = async ({ request, cookies }) => {
	try {
		console.log(`Creating new submission...`)
		const { firstName, lastName, email, business = '', message } = await request.json()
		const submission = {
			type: `CONTACT`,
			firstName,
			lastName,
			email,
			business,
			message,
			createdAt: serverTimestamp()
		}

		const contactsRef = await firestore.collection('submissions').add(submission)

		console.log(`Submission created with id of ${contactsRef.id}`)

		return json(
			{
				status: `success`
			},
			{
				status: 201
			}
		)
	} catch (err) {
		console.error(err)
		return json(
			{
				status: `error`,
				message: err
			},
			{
				status: 500 // a 400 is a validation error
			}
		)
	}
}
