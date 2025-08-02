<script lang="ts">
	import '../app.css'
	import Navbar from '$lib/components/Navbar.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import { afterNavigate } from '$app/navigation'
	let { children } = $props()

	afterNavigate(() => {
		/**
		 * This is a preline/styling thing for tailwind and Preline library
		 */
		window.HSStaticMethods.autoInit()
	})
</script>

<Navbar />

<main class="mx-auto max-w-4xl px-4">
	{@render children()}
</main>

<Footer />
