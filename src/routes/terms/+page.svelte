<script>
	import { marked } from 'marked';
	import content from './terms.md?raw'; // Add ?raw to import as a string
</script>

{@html marked(content)}
