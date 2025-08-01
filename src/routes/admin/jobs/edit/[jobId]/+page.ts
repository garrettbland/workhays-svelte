import type { PageLoad } from './$types'
import { getJobById } from '$lib/jobs.admin'
import { error } from '@sveltejs/kit'
import type { JobWithID } from '$lib/types'

export const load: PageLoad = async ({ params }): Promise<JobWithID> => {
	try {
		const job = await getJobById(params.jobId)
		return job
	} catch (err) {
		error(404, JSON.stringify(err))
	}
}
