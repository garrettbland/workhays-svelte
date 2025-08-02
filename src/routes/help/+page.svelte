<script>
	import { marked } from 'marked'
	import helpContent from './help.md?raw' // Add ?raw to import as a string
</script>

<div class="prose prose-sm">
	<h1>Help</h1>
	{@html marked(helpContent)}
</div>
