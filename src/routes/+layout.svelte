<script lang="ts">
	import '../app.css'
	import Navbar from '$lib/components/Navbar.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/state'

	let { children } = $props()

	import { pushState } from '$app/navigation'

	import ModalTest from '$lib/components/ModalTest.svelte'
	import { miscStorage } from '$lib/cache.svelte'

	// let showModal = $state(false)

	afterNavigate(() => {
		/**
		 * This is a preline/styling thing for tailwind and Preline library
		 */
		window.HSStaticMethods.autoInit()
	})

	// $effect(() => {
	// 	console.log(`miscStorage changed:`, miscStorage)
	// })

	// $effect(() => {
	// 	if (page.state.showModal) {
	// 		showModal = true
	// 	} else {
	// 		showModal = false
	// 	}
	// })
</script>

<!-- {@render modal()} -->

<!-- {#if page.state.showModal}
	<ModalTest close={() => history.back()} />
{/if} -->

<Navbar />

<main class="mx-auto max-w-4xl px-4">
	{@render children()}
</main>

<Footer />
