<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { afterNavigate } from '$app/navigation';
	let { children } = $props();

	afterNavigate(() => {
		window.HSStaticMethods.autoInit();
	});
</script>

<Navbar />

<main class="prose mx-auto max-w-4xl px-4">
	{@render children()}
</main>

<Footer />
