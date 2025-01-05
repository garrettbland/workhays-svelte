<script lang="ts">
	import { page } from '$app/stores';
	import { FOOTER_LINKS } from '$lib/constants';
</script>

<footer class="bg-gray-200">
	<div class="prose mx-auto max-w-4xl px-4">
		<p>This is a footer. It appears on every page.</p>
		<p>
			The current page is {$page.url.pathname}.
		</p>
		<ul class="flex space-x-4">
			{#each FOOTER_LINKS as link}
				<li>
					<a href={link.href} class="nav-item">{link.name}</a>
				</li>
			{/each}
		</ul>
		<p>
			© {new Date().getFullYear()} Work Hays
		</p>
	</div>
</footer>
