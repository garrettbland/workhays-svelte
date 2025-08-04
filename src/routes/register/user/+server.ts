/**
 * Create new user account and add to Firestore
 */

import { json } from '@sveltejs/kit'
import admin from 'firebase-admin'
const serverTimestamp = () => FieldValue.serverTimestamp()
import { getApps } from 'firebase-admin/app'
import { FieldValue } from 'firebase-admin/firestore'
import { PROJECT_ID, PRIVATE_KEY, CLIENT_EMAIL } from '$env/static/private'
import type { User } from '$lib/types.js'

const serviceAccount: admin.ServiceAccount = {
	privateKey: PRIVATE_KEY,
	projectId: PROJECT_ID.split(String.raw`\n`).join('\n'),
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
		// return json(
		// 	{
		// 		status: `error`,
		// 		message: `User already exists`
		// 	},
		// 	{
		// 		status: 200
		// 	}
		// )

		const { firstName, lastName, email, password } = await request.json()

		let newUserId: string

		/**
		 * First, we need to create the user in Firebase Authentication
		 */
		try {
			/**
			 * auth/email-already-exists	Email already in use
			 * auth/invalid-email	Email is invalid
			 * auth/invalid-password	Password doesn’t meet requirements
			 * auth/uid-already-exists	Custom UID already in use
			 * auth/invalid-uid	UID is too long or improperly formatted
			 * auth/internal-error	Unexpected internal error
			 */
			const user = await firebaseAdmin.auth().createUser({
				email,
				password,
				displayName: `${firstName} ${lastName}`
			})

			newUserId = user.uid
		} catch (err) {
			/**
			 * Error in firebase auth
			 */
			return json(
				{
					status: `ERROR`,
					message: err.code
				},
				{
					status: 200
				}
			)
		}

		console.log(`User created with uid: ${newUserId}`)

		/**
		 * Next, we prepare the user document
		 */
		const submission: User = {
			firstName,
			lastName,
			email,
			password,
			uid: newUserId, // Created by Firebase Auth above
			role: 'USER',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		}

		/**
		 * Finally, we add the user document to the 'users' collection in Firestore
		 */
		await firestore.collection('users').doc(newUserId).set(submission)

		console.log(`User document created in Firestore`)

		return json(
			{
				status: `SUCCESS`,
				newUser: submission
			},
			{
				status: 201
			}
		)
	} catch (err) {
		console.log('IS THIS HAPPENING?')
		console.log(err)
		return json(
			{
				status: `ERROR`,
				message: err.message || 'GENERAL_ERROR'
			},
			{
				status: 500 // a 400 is a validation error
			}
		)
	}
}
