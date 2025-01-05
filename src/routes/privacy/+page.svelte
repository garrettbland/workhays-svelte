<script>
	import { marked } from 'marked';
	import privacyContent from './privacy.md?raw'; // Add ?raw to import as a string
</script>

{@html marked(privacyContent)}
