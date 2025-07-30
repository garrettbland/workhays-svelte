<script lang="ts">
	/**
	 * Rich Text Editor using TipTap
	 * @see https://tiptap.dev/
	 */

	import { onMount, onDestroy } from 'svelte'
	import { Editor, type JSONContent } from '@tiptap/core'
	import StarterKit from '@tiptap/starter-kit'
	import Placeholder from '@tiptap/extension-placeholder'
	import Underline from '@tiptap/extension-underline'
	import Link from '@tiptap/extension-link'

	/**
	 * Arguments
	 * Initial JSON content (TipTap accepts JSON directly)
	 */
	let {
		value = $bindable(),
		placeholder = ''
		// getEditorRef
	}: {
		value?: JSONContent
		placeholder?: string
		// getEditorRef?: () => Editor | null // let parent grab the editor instance
	} = $props()

	/**
	 * Set editor instance variable
	 */
	let editor: Editor | null = null

	onMount(() => {
		/**
		 * Create the editor instance
		 */
		editor = new Editor({
			element: document.querySelector('#hs-editor-tiptap [data-hs-editor-field]')!,
			content: value,
			editorProps: {
				attributes: {
					class: 'relative min-h-40 p-3 text-sm'
				}
			},
			onUpdate: ({ editor }) => {
				// Get JSON on each change
				const json = editor.getJSON()

				// Update the local prop so bindings reflect it
				value = json
			},
			extensions: [
				// StarterKit contains stuff like Bold, Italic, etc.
				// https://tiptap.dev/docs/editor/extensions/functionality/starterkit
				StarterKit.configure({
					history: false
				}),
				Placeholder.configure({
					placeholder: placeholder,
					emptyNodeClass: 'before:text-gray-500'
				}),
				Underline,
				Link.configure({
					HTMLAttributes: {
						class:
							'inline-flex items-center gap-x-1 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-white'
					}
				})
			]
		})

		actions.forEach(({ id, fn }) => {
			const action = document.querySelector(id)

			if (action === null) return

			action.addEventListener('click', fn)
		})
	})

	onDestroy(() => editor?.destroy())

	const actions = [
		{
			id: '#hs-editor-tiptap [data-hs-editor-bold]',
			fn: () => editor?.chain().focus().toggleBold().run()
		},
		{
			id: '#hs-editor-tiptap [data-hs-editor-italic]',
			fn: () => editor?.chain().focus().toggleItalic().run()
		},
		{
			id: '#hs-editor-tiptap [data-hs-editor-underline]',
			fn: () => editor?.chain().focus().toggleUnderline().run()
		},
		{
			id: '#hs-editor-tiptap [data-hs-editor-strike]',
			fn: () => editor?.chain().focus().toggleStrike().run()
		},
		{
			id: '#hs-editor-tiptap [data-hs-editor-link]',
			fn: () => {
				const url = window.prompt('URL') ?? ''
				editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
			}
		},
		{
			id: '#hs-editor-tiptap [data-hs-editor-ul]',
			fn: () => editor?.chain().focus().toggleBulletList().run()
		}
	]
</script>

<div
	id="description"
	class="rounded-lg border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
>
	<div id="hs-editor-tiptap">
		<div
			class="flex gap-x-0.5 rounded-t-xl border-b border-gray-200 bg-white p-2 align-middle dark:border-neutral-700"
		>
			<button
				class="inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
				type="button"
				data-hs-editor-bold=""
				aria-label="Bold"
			>
				<svg
					class="size-4 shrink-0"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M14 12a4 4 0 0 0 0-8H6v8"></path>
					<path d="M15 20a4 4 0 0 0 0-8H6v8Z"></path>
				</svg>
			</button>
			<button
				class="inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
				type="button"
				data-hs-editor-italic=""
				aria-label="Italic"
			>
				<svg
					class="size-4 shrink-0"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="19" x2="10" y1="4" y2="4"></line>
					<line x1="14" x2="5" y1="20" y2="20"></line>
					<line x1="15" x2="9" y1="4" y2="20"></line>
				</svg>
			</button>
			<button
				class="inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
				type="button"
				data-hs-editor-underline=""
				aria-label="Underline"
			>
				<svg
					class="size-4 shrink-0"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
					<line x1="4" x2="20" y1="20" y2="20"></line>
				</svg>
			</button>
			<button
				class="inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
				type="button"
				data-hs-editor-link=""
				aria-label="Link"
			>
				<svg
					class="size-4 shrink-0"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
					<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
				</svg>
			</button>
			<button
				class="inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
				type="button"
				data-hs-editor-ul=""
				aria-label="Unordered List"
			>
				<svg
					class="size-4 shrink-0"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="8" x2="21" y1="6" y2="6"></line>
					<line x1="8" x2="21" y1="12" y2="12"></line>
					<line x1="8" x2="21" y1="18" y2="18"></line>
					<line x1="3" x2="3.01" y1="6" y2="6"></line>
					<line x1="3" x2="3.01" y1="12" y2="12"></line>
					<line x1="3" x2="3.01" y1="18" y2="18"></line>
				</svg>
			</button>
		</div>

		<div class="prose" data-hs-editor-field=""></div>
	</div>
</div>
