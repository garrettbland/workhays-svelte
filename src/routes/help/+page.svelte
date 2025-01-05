<script>
	import { marked } from 'marked';
	import helpContent from './help.md?raw'; // Add ?raw to import as a string
</script>

{@html marked(helpContent)}
