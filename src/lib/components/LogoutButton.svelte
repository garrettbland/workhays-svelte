<script>
	import { logout } from '$lib/auth';
	import { goto } from '$app/navigation';

	const handleLogout = async () => {
		await logout();
		goto('/login');
	};
</script>

<button on:click={handleLogout}>Logout</button>
