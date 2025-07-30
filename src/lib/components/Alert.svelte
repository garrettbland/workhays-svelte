<script lang="ts">
	/**
	 * Alert component to display messages
	 * @param {string} title - The message to display
	 * @param {'alert' | 'info' | 'success' | 'warning'} type - The type of alert to display
	 * @example
	 * <Alert title="This is an alert" type="alert" />
	 * <Alert title="This is an info message" type="info" />
	 * <Alert title="This is a success message" type="success" />
	 * <Alert title="This is a warning message" type="warning" />
	 */

	let {
		title,
		type
	}: {
		title: string
		type: 'alert' | 'info' | 'success' | 'warning' | 'secondary'
	} = $props()

	const typeClassesMap: Record<typeof type, string> = {
		alert: 'bg-red-600 text-white',
		info: 'bg-blue-600 text-white',
		success: 'bg-green-600 text-white',
		warning: 'bg-yellow-600 text-white',
		secondary: 'bg-gray-600 text-white'
	}
</script>

<div class={`rounded-md p-4 text-sm ${typeClassesMap[type]}`}>
	{title}
</div>
