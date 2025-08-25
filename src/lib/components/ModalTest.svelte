<script lang="ts">
	let { close }: { close: () => void } = $props()
</script>

<div class="absolute left-0 top-0 h-screen w-screen bg-black/50">
	<div class="bg-white p-8">
		<div class="p-8">
			JOb details stuff?
			<button onclick={() => close()}> Close </button>
		</div>
	</div>
</div>
