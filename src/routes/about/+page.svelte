<script>
	import { marked } from 'marked'
	import aboutContent from './about.md?raw' // Add ?raw to import as a string
</script>

<div class="prose prose-sm">
	<h1>About Us</h1>
	<p>Last updated: Aug 1, 2025</p>
	{@html marked(aboutContent)}
</div>
