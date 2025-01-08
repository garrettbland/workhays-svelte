<script>
	import { authData } from '$lib/auth.svelte'
</script>

<h1>Dashboard</h1>

<p>Welcome, {authData?.user?.email}</p>
