<script>
	import { login } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authState } from '$lib/auth';
	let email = '';
	let password = '';
	let error = '';

	$: if ($authState.user && $authState.loading === false) {
		goto('/admin');
	}

	const handleLogin = async () => {
		try {
			await login(email, password);
			error = ''; // Clear any previous error
			console.log('logged in!');
			goto('/admin');
		} catch (err) {
			error = err.message;
		}
	};
</script>

{#if $authState.loading && !$authState.user}
	<p>Loading...</p>
{:else}
	<form on:submit|preventDefault={handleLogin}>
		<input type="email" bind:value={email} placeholder="Email" required />
		<input type="password" bind:value={password} placeholder="Password" required />
		<button type="submit">Login</button>
		{#if error}
			<p style="color: red;">{error}</p>
		{/if}
	</form>

	<a href="/forgot-password">Forgot Password</a>
{/if}
