<script>
	import { marked } from 'marked';
	import aboutContent from './about.md?raw'; // Add ?raw to import as a string
</script>

{@html marked(aboutContent)}
