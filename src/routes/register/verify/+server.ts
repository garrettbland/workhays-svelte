/**
 * Create new user account and add to Firestore
 */

import { json, redirect } from '@sveltejs/kit'
import admin from 'firebase-admin'
const serverTimestamp = () => FieldValue.serverTimestamp()
import { getApps } from 'firebase-admin/app'
import { FieldValue } from 'firebase-admin/firestore'
import {
	PROJECT_ID,
	PRIVATE_KEY,
	CLIENT_EMAIL,
	MAILGUN_API_KEY,
	MAILGUN_DOMAIN
} from '$env/static/private'
import type { User } from '$lib/types.js'
// import Mailgun from 'mailgun.js'
// import formData from 'form-data'

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

export const GET = async ({ request, cookies, url }) => {
	const code = url.searchParams.get('code')

	if (!code) {
		throw redirect(302, '/error?message=missing_code')
	}

	/**
	 * Query the users collection and find the code. If it exists,
	 * then the user has verified. If not, 302 redirect
	 */
	const snapshot = await firestore
		.collection('users')
		.where('emailVerificationCode', '==', code)
		.limit(1)
		.get()

	if (snapshot.empty) {
		throw redirect(302, '/error?message=invalid_token')
	}

	const doc = snapshot.docs[0]
	const { uid, emailVerified } = doc.data()

	/**
	 * User has already verified, skip the rest
	 */
	if (emailVerified === true) {
		throw redirect(302, '/error?message=expired_link')
	}

	/**
	 * Update the user to show that they verified their email
	 */
	await firestore.collection('users').doc(uid).update({
		emailVerified: true
	})

	throw redirect(302, '/sign-in?message=verified')
}
