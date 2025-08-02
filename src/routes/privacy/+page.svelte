<script>
	import { marked } from 'marked'
	import privacyContent from './privacy.md?raw' // Add ?raw to import as a string
</script>

<div class="prose prose-sm">
	<h1>Privacy Policy</h1>
	<p>Last updated: Aug 1, 2025</p>
	{@html marked(privacyContent)}
</div>
