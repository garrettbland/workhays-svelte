<script lang="ts">
	import type { PageData } from './$types';
	let { job }: { job: PageData } = $props();
</script>

<h1>{job.title}</h1>
<div>{job.description}</div>
