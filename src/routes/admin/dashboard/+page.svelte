<script>
	import { authData } from '$lib/auth.svelte'
</script>

<h1>Dashboard</h1>

<p>Welcome, {authData?.user?.firstName}</p>

<pre>
	<code>
{JSON.stringify(authData.user, null, 4)}
	</code>
</pre>
