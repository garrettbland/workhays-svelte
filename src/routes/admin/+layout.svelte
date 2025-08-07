<script lang="ts">
	import { goto } from '$app/navigation'
	import { ADMIN_NAV_LINKS } from '$lib/constants'
	import { authData } from '$lib/auth.svelte'
	import Alert from '$lib/components/Alert.svelte'
	import { getEmployerById } from '$lib/employer.admin'
	import { onMount } from 'svelte'
	import type { Employer } from '$lib/types'

	let employer = $state<Employer | undefined>(undefined)

	// onMount(async () => {
	// 	const res = await getEmployerById(authData.user?.memberOf[0] ?? '')
	// 	employer = res
	// })

	$effect(() => {
		if (authData.user) {
			const getEmployer = async () => {
				const data = await getEmployerById(authData.user?.memberOf[0] ?? '')
				return data
			}

			if (authData.user.memberOf.length > 0) {
				getEmployer().then((data) => (employer = data))
			}
		}
	})

	let { children } = $props()

	$effect(() => {
		if (!authData.isLoading) {
			if (!authData.auth) {
				goto('/sign-in')
			} else if (authData.user?.memberOf.length === 0) {
				goto('/register/user')
			}
		}
	})
</script>

<!-- Dont need this anymore since the user is redirected to the employer registration page if they are not part of an employer -->
<!-- {#if authData.auth?.emailVerified === false}
	<div class="my-4">
		<Alert
			title="Check your email to verify your account. Actions will be limited until then."
			type="warning"
		/>
	</div>
{/if} -->

{#if employer?.status === 'PENDING'}
	<div class="my-4">
		<Alert
			title={`<p>Your employer account is pending approval. You will be notified once approved. You can still create job postings, but they will not be visible until approved</p><p class="mt-4">If it's been more than a few days, please <a class="underline" href="/contact">contact us</a> and let us know.</p>`}
			type="warning"
		/>
	</div>
{/if}

{#if authData.isLoading || !authData.auth}
	<Alert type="secondary" title="Loading..." />
{:else}
	<!-- {JSON.stringify(authData.auth, null, 4)} -->
	<div class="relative grid grid-cols-12 gap-6">
		<div class="col-span-3">
			<div class="max-w-32 border-e-2 border-gray-200 dark:border-neutral-700">
				<nav class="-me-0.5 flex flex-col space-y-3">
					{#each ADMIN_NAV_LINKS as link}
						<a
							class="inline-flex items-center gap-2 whitespace-nowrap border-e-2 border-transparent py-1 pe-4 text-sm text-gray-500 no-underline hover:text-blue-800 focus:text-blue-800 focus:outline-none dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
							href={link.href}
						>
							{link.name}
						</a>
					{/each}
				</nav>
			</div>
		</div>
		<div class="col-span-9">
			{@render children()}
		</div>
	</div>
{/if}
