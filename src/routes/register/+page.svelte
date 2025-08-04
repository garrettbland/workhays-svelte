<script lang="ts">
	import Button from '$lib/components/Button.svelte'
	import Link from '$lib/components/Link.svelte'
	import Register from '$lib/components/Register.svelte'
	import type { User } from '$lib/types'

	let currentStep = $state<number>(2)
	let newUser = $state<User | null>(null)

	/**
	 * Logic that happens after user is registered successfully
	 */
	const handleUserCreationSuccess = (user: User) => {
		newUser = user
		currentStep = 2
	}
</script>

<div class="prose prose-sm mb-8">
	<h1>Register</h1>
	<p>Start creating free job listings today. To register, follow the steps below.</p>
	<p>
		Please note, after submission your employers status will be <strong>pending</strong>. This means
		jobs wont be visible to the public. We manually review these registrations and approve usually
		in two to three business days.
	</p>
	<p>
		If you have any questions or need assistance, please <a href="/contact">contact us.</a>
	</p>
</div>

<!-- Stepper -->
<!-- Matching same width as "prose" class -->
<ul class="relative flex max-w-[65ch] flex-col gap-2">
	<!-- Item -->
	<li class="group flex flex-1 gap-x-2">
		<div class="flex min-h-7 min-w-7 flex-col items-center align-middle text-xs">
			<span
				class="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-800 dark:bg-neutral-700 dark:text-white"
			>
				{currentStep === 1 ? '1' : '✓'}
			</span>
			<!-- Horizontal Line -->
			<div class="mt-2 h-full w-px bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
		</div>
		<div class="grow pb-5">
			<span class="block text-sm font-medium text-gray-800 dark:text-white">
				Create Your Account
			</span>
			<p class="text-sm text-gray-500 dark:text-neutral-500">
				First we will need to get your account setup with a username and password.
			</p>
			{#if currentStep === 1}
				<div class="mt-8">
					<Register onSuccess={(uid) => handleUserCreationSuccess(uid)} />
				</div>
			{/if}
		</div>
	</li>
	<!-- End Item -->

	<!-- Item -->
	<li class="group flex flex-1 gap-x-2">
		<div class="flex min-h-7 min-w-7 flex-col items-center align-middle text-xs">
			<span
				class="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-800 dark:bg-neutral-700 dark:text-white"
			>
				2
			</span>
			<div class="mt-2 h-full w-px bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
		</div>
		<div class="grow pb-5">
			<span class="block text-sm font-medium text-gray-800 dark:text-white">
				Create or Join an Employer
			</span>
			<p class="text-sm text-gray-500 dark:text-neutral-500">
				Once creating an account and logging, we will gather information about the employer you are
				representing or a part of. Or, if the employer already exists, you can request to join.
			</p>
			{#if currentStep === 2}
				<div class="prose prose-sm my-4">
					<p class="rounded-lg border border-green-300 bg-green-50 p-2">
						Your user account has been created. An email should be sent to <strong
							>{newUser?.email}</strong
						> to verify ownership. Please click the link below to login and continue the registration
						process.
					</p>
				</div>
				<Link type="primary" href="/sign-in" title="Sign In" />
			{/if}
		</div>
	</li>
	<!-- End Item -->
</ul>
<!-- End Stepper -->
