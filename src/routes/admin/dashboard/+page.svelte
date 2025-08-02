<script>
	import { authData } from '$lib/auth.svelte'
</script>

<div class="prose prose-sm mb-4">
	<h1>Dashboard</h1>
	<p>Welcome, {authData?.user?.firstName}</p>
	<p>
		You can manage your account, jobs, and settings from the links below, or on the sidebar. If you
		need help, please <a href="/contact">contact us</a>.
	</p>
	<ul>
		<li><a href="/admin/jobs">My Jobs</a></li>
		<li><a href="/admin/jobs/new">Create a new job</a></li>
		<li><a href="/admin/settings">Employer Settings</a></li>
		<li><a href="/admin/account">My Account Settings</a></li>
	</ul>
	<p>
		Additional features and settings will be added in the future, so please check back here often.
		New features such as job analytics & performance, multiple users, and promoted listings are
		coming soon.
	</p>
</div>

<!-- <pre>
	<code>
{JSON.stringify(authData.user, null, 4)}
	</code>
</pre> -->
