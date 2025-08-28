<script>
	import { SITE_NAME, NAV_LINKS } from '$lib/constants'
	import { authData } from '$lib/auth.svelte'
	import Link from './Link.svelte'
</script>

<header
	class="relative flex w-full flex-wrap bg-white py-3 text-sm sm:flex-nowrap sm:justify-start dark:bg-neutral-800"
>
	<nav class="mx-auto w-full max-w-4xl px-4 sm:flex sm:items-center sm:justify-between">
		<div class="flex items-center justify-between">
			<a
				class="flex-none text-xl font-bold text-blue-800 focus:opacity-80 focus:outline-none dark:text-white"
				href="/"
				aria-label={SITE_NAME}
			>
				{SITE_NAME}
			</a>
			<div class="sm:hidden">
				<button
					type="button"
					class="hs-collapse-toggle relative flex items-center justify-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
					id="hs-navbar-example-collapse"
					aria-expanded="false"
					aria-controls="hs-navbar-example"
					aria-label="Toggle navigation"
					data-hs-collapse="#hs-navbar-example"
				>
					<svg
						class="size-4 shrink-0 hs-collapse-open:hidden"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line
							x1="3"
							x2="21"
							y1="18"
							y2="18"
						/></svg
					>
					<svg
						class="hidden size-4 shrink-0 hs-collapse-open:block"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
					>
					<span class="sr-only">Toggle navigation</span>
				</button>
			</div>
		</div>
		<div
			id="hs-navbar-example"
			class="hs-collapse hidden grow basis-full overflow-hidden transition-all duration-300 sm:block"
			aria-labelledby="hs-navbar-example-collapse"
		>
			<div
				class="mt-5 flex flex-col gap-5 sm:mt-0 sm:flex-row sm:items-center sm:justify-end sm:ps-5"
			>
				<!-- TO DO: Active page style and aria-current="page" -->
				{#each NAV_LINKS as link}
					<a
						class="font-medium text-gray-700 hover:text-black hover:underline focus:text-black focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
						href={link.href}>{link.name}</a
					>
				{/each}
				<div class="mt-5 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:items-center sm:ps-5">
					{#if authData.user}
						{#if authData.user?.memberOf?.length === 0}
							<button
								class="inline-flex w-max flex-1 items-center gap-x-2 rounded-lg border border-transparent bg-blue-800 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
								><a href="/register/user">Complete Registration</a></button
							>
						{:else}
							<Link href="/admin/dashboard" title="Dashboard" type="primary" />
							<!-- <button
								class="inline-flex w-max flex-1 items-center gap-x-2 rounded-lg border border-transparent bg-blue-800 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
								><a href="/admin/dashboard">Dashboard</a></button
							> -->
						{/if}
					{:else}
						<Link href="/sign-in" title="Sign In" type="secondary" />
						<Link href="/register" title="Register" type="primary" />
					{/if}
				</div>
			</div>
		</div>
	</nav>
</header>
