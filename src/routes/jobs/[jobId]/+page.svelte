<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const job = $derived(data);
</script>

<h1>{job.title}</h1>
<div>{job.description}</div>
