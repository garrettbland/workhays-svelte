import type { PageLoad } from '../$types'
import { getPublicEmployerById } from '$lib/employer'
import { error } from '@sveltejs/kit'
import type { EmployerWithID } from '$lib/types'

/**
 * Loads the job data on the server side initially, then
 * subsequent requests are done client side.
 *
 * This will make SEO happy so it can render job pages in a
 * traditional SSR way, but for humans jumping around jobs it
 * will be SPA and snappy with no calls to the backend/lambda
 */
export const load: PageLoad = async ({ params }): Promise<EmployerWithID> => {
	try {
		const employer = await getPublicEmployerById(params.employerId)
		return employer
	} catch (err) {
		error(404, JSON.stringify(err))
	}
}
