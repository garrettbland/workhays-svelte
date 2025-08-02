<script>
	import { marked } from 'marked'
	import content from './terms.md?raw' // Add ?raw to import as a string
</script>

<div class="prose prose-sm">
	<h1>Terms of Service</h1>
	<p>Last updated: December 13, 2021</p>
	{@html marked(content)}
</div>
