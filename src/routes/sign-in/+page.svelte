<script>
	import { signIn, authData } from '$lib/auth.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	let emailChangeSuccess = page.url.searchParams.get('emailChanged') === 'true'

	let email = $state('')
	let password = $state('')
	let error = $state('')
	let isSigningIn = $state(false)

	/**
	 * If the user is logged in, redirect to the admin page
	 */
	$effect(() => {
		if (authData.auth && authData.isLoading === false) {
			goto('/admin/dashboard')
		}
	})

	const handleSignIn = async () => {
		try {
			isSigningIn = true
			await signIn(email, password)
			error = '' // Clear any previous error
			goto('/admin/dashboard')
		} catch (err) {
			error = err.message
			isSigningIn = false
		}
	}
</script>

{#if emailChangeSuccess}
	<p class="h-48 bg-green-500 text-white">Yay email change was a success 🎉</p>
{/if}

{#if authData.isLoading}
	<p>Loading...</p>
{:else}
	<div
		class="mx-auto mt-12 max-w-md rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
	>
		<div class="p-4 sm:p-7">
			<div class="text-center">
				<h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
				<p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
					Don't have an account yet?
					<a
						class="font-medium text-blue-800 decoration-2 hover:underline focus:underline focus:outline-none dark:text-blue-800"
						href="/register"
					>
						Register here
					</a>
				</p>
			</div>

			<div class="mt-5">
				<button
					type="button"
					class="inline-flex hidden w-full items-center justify-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
				>
					<svg class="h-auto w-4" width="46" height="47" viewBox="0 0 46 47" fill="none">
						<path
							d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
							fill="#4285F4"
						/>
						<path
							d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
							fill="#34A853"
						/>
						<path
							d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
							fill="#FBBC05"
						/>
						<path
							d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
							fill="#EB4335"
						/>
					</svg>
					Sign in with Google
				</button>

				<div
					class="flex items-center py-3 text-xs uppercase text-gray-400 before:me-6 before:flex-1 before:border-t before:border-gray-200 after:ms-6 after:flex-1 after:border-t after:border-gray-200 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600"
				>
					Or
				</div>

				<!-- Form -->
				<form on:submit|preventDefault={handleSignIn}>
					<div class="grid gap-y-4">
						<!-- Form Group -->
						<div>
							<label for="email" class="mb-2 block text-sm dark:text-white">Email address</label>
							<div class="relative">
								<input
									bind:value={email}
									type="email"
									id="email"
									name="email"
									class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
									required
									aria-describedby="email-error"
								/>
								<div class="pointer-events-none absolute inset-y-0 end-0 hidden pe-3">
									<svg
										class="size-5 text-red-600"
										width="16"
										height="16"
										fill="currentColor"
										viewBox="0 0 16 16"
										aria-hidden="true"
									>
										<path
											d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
										/>
									</svg>
								</div>
							</div>
							<p class="mt-2 hidden text-xs text-red-600" id="email-error">
								Please include a valid email address so we can get back to you
							</p>
						</div>
						<!-- End Form Group -->

						<!-- Form Group -->
						<div>
							<div class="flex items-center justify-between">
								<label for="password" class="mb-2 block text-sm dark:text-white">Password</label>
							</div>

							<div class="relative">
								<input
									bind:value={password}
									type="password"
									id="password"
									name="password"
									class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-800 focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
									required
									aria-describedby="password-error"
								/>
								<div class="pointer-events-none absolute inset-y-0 end-0 hidden pe-3">
									<svg
										class="size-5 text-red-600"
										width="16"
										height="16"
										fill="currentColor"
										viewBox="0 0 16 16"
										aria-hidden="true"
									>
										<path
											d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
										/>
									</svg>
								</div>
							</div>
							<a
								class="inline-flex items-center gap-x-1 text-sm font-medium text-blue-800 decoration-2 hover:underline focus:underline focus:outline-none dark:text-blue-800"
								href="/reset-password">Forgot password?</a
							>
							<p class="mt-2 hidden text-xs text-red-600" id="password-error">
								8+ characters required
							</p>
						</div>
						<!-- End Form Group -->

						<!-- Checkbox -->
						<div class="flex hidden items-center">
							<div class="flex">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									class="mt-0.5 shrink-0 rounded border-gray-200 text-blue-800 focus:ring-blue-800 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-800 dark:checked:bg-blue-800 dark:focus:ring-offset-gray-800"
								/>
							</div>
							<div class="ms-3">
								<label for="remember-me" class="text-sm dark:text-white">Remember me</label>
							</div>
						</div>
						<!-- End Checkbox -->

						<button
							type="submit"
							class="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-800 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
							disabled={isSigningIn}
						>
							{#if isSigningIn}
								<span
									class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
									role="status"
									aria-label="loading"
								></span>
							{/if}
							{isSigningIn ? 'Loading...' : 'Sign In'}</button
						>
					</div>
					{#if error}
						<p style="color: red;">{error}</p>
					{/if}
				</form>
				<!-- End Form -->
			</div>
		</div>
	</div>
{/if}
