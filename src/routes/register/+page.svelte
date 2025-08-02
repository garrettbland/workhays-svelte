<script lang="ts">
	let currentStep = $state<number>(1)
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
			<p class="mb-8 text-sm text-gray-500 dark:text-neutral-500">
				First we will need to get your account setup with a username and password.
			</p>
			{#if currentStep === 1}
				<div class="space-y-4">
					<div>
						<label for="email" class="mb-2 block text-sm font-medium dark:text-white">Email</label>
						<input
							type="text"
							id="email"
							class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							placeholder="Email Address"
							name="email"
						/>
						<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">helper stuff</p>
					</div>

					<div>
						<label for="password" class="mb-2 block text-sm font-medium dark:text-white"
							>Password</label
						>
						<input
							type="password"
							id="password"
							class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
							placeholder="Password"
							name="password"
						/>
						<p class="mt-2 text-sm text-red-500 dark:text-neutral-500">helper stuff</p>
					</div>
				</div>

				<button onclick={() => (currentStep = 2)}>NExt step</button>
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
				Second, we will gather information about the employer you are representing or a part of. Or,
				if the employer already exists, you can request to join.
			</p>
			{#if currentStep === 2}
				<div class="h-[500px]">content</div>
			{/if}
		</div>
	</li>
	<!-- End Item -->
</ul>
<!-- End Stepper -->
