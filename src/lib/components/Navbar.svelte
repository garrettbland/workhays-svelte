<script>
	import { SITE_NAME, NAV_LINKS } from '$lib/constants';
</script>

<nav class="bg-gray-100">
	<div class="mx-auto flex max-w-4xl items-center justify-between p-4">
		<a href="/" class="logo">{SITE_NAME}</a>
		<ul class="flex space-x-4">
			{#each NAV_LINKS as link}
				<li>
					<a href={link.href} class="nav-item">{link.name}</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>
