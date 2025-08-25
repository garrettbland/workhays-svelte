<script lang="ts">
	/**
	 * Button component
	 * @param {string} title - The text to display on the button
	 * @param {string} type - The type of button to display
	 * @param {boolean} disabled - Whether the button is disabled
	 * @example
	 * <Button title="Click me" type="primary" />
	 * <Button title="Submit" type="secondary" disabled={true} />
	 */
	let {
		title,
		type,
		href,
		target
	}: {
		title: string
		type: 'primary' | 'secondary' | 'danger' | 'success'
		href: string
		target?: '_self' | '_blank'
	} = $props()

	const typeClassesMap: Record<typeof type, string> = {
		primary: 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white',
		secondary: 'bg-gray-600 hover:bg-gray-700 focus:bg-gray-700 text-white',
		danger: 'bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white',
		success: 'bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white'
	}
</script>

<a
	{href}
	{...target ? { target } : {}}
	class={`focus:outline-hidden inline-flex items-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium focus:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 ${typeClassesMap[type]}`}
>
	{title}
</a>
