<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import type { Job, JobInputs, FormStatus } from '$lib/types'
	import { INDUSTRIES, JOB_TYPES, JOB_STATUSES } from '$lib/constants'
	import { Editor } from '@tiptap/core'
	import StarterKit from '@tiptap/starter-kit'
	import Placeholder from '@tiptap/extension-placeholder'
	import Underline from '@tiptap/extension-underline'
	import Link from '@tiptap/extension-link'

	let {
		currentJob,
		handleSubmit,
		onStatusChange,
		clearInputsOnSubmit
	}: {
		currentJob?: Job
		handleSubmit: (job: JobInputs) => Promise<void>
		onStatusChange: (status: FormStatus) => void
		clearInputsOnSubmit: boolean
	} = $props()

	const DEFAULT_EMPTY_JOB: JobInputs = {
		title: '',
		description: {},
		employerTitle: '',
		employerId: '',
		type: '' as JOB_TYPES,
		applicationLink: '',
		status: JOB_STATUSES.Draft,
		industry: '' as INDUSTRIES,
		isDeleted: false
	}

	let isLoading = $state(false)
	let job = $state<JobInputs>(DEFAULT_EMPTY_JOB)

	const clearInputs = () => (job = DEFAULT_EMPTY_JOB)

	const handleSubmitCallback = async () => {
		try {
			onStatusChange('IDLE')
			isLoading = true
			await handleSubmit({
				...job,
				description: editor.getJSON() // Saving directly as JSON to firebase
			})
			clearInputsOnSubmit && clearInputs()
			onStatusChange('SUCCESSFUL')
		} catch (err) {
			console.error(`Error submitting form`, err)
			onStatusChange('ERROR')
		} finally {
			isLoading = false
		}
	}

	let editor: Editor

	onMount(() => {
		editor = new Editor({
			element: document.querySelector('#hs-editor-tiptap [data-hs-editor-field]')!,
			editorProps: {
				attributes: {
					class: 'relative min-h-40 p-3 text-sm'
				}
			},
			extensions: [
				// StarterKit contains stuff like Bold, Italic, etc.
				// https://tiptap.dev/docs/editor/extensions/functionality/starterkit
				StarterKit.configure({
					history: false
				}),
				Placeholder.configure({
					placeholder: 'Enter the job description and details here',
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

	$effect(() => {
		/**
		 * If loading a current job, set it here
		 */
		if (currentJob) {
			job = { ...currentJob }
			editor.commands.setContent(currentJob.description)
		}
	})

	onDestroy(() => {
		if (editor) {
			editor.destroy()
		}
	})

	const actions = [
		{
			id: '#hs-editor-tiptap [data-hs-editor-bold]',
			fn: () => editor.chain().focus().toggleBold().run()
		},
		{
			id: '#hs-editor-tiptap [data-hs-editor-italic]',
			fn: () => editor.chain().focus().toggleItalic().run()
		},
		{
			id: '#hs-editor-tiptap [data-hs-editor-underline]',
			fn: () => editor.chain().focus().toggleUnderline().run()
		},
		{
			id: '#hs-editor-tiptap [data-hs-editor-strike]',
			fn: () => editor.chain().focus().toggleStrike().run()
		},
		{
			id: '#hs-editor-tiptap [data-hs-editor-link]',
			fn: () => {
				const url = window.prompt('URL')
				editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
			}
		},
		{
			id: '#hs-editor-tiptap [data-hs-editor-ul]',
			fn: () => editor.chain().focus().toggleBulletList().run()
		}
	]
</script>

<form onsubmit={handleSubmitCallback} class="space-y-8">
	<!-- Job Title -->
	<div>
		<label for="title" class="mb-2 block text-sm font-medium dark:text-white">Job Title</label>
		<input
			type="text"
			id="title"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="Sales Associate"
			aria-describedby="hs-input-helper-text"
			name="title"
			bind:value={job.title}
		/>
		<!-- <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500" id="hs-input-helper-text">
		Helper text
	</p> -->
	</div>

	<!-- Description -->
	<div>
		<label for="description" class="mb-2 block text-sm font-medium dark:text-white"
			>Description</label
		>
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
					<!-- <button
						class="inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
						type="button"
						data-hs-editor-strike=""
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
							<path d="M16 4H9a3 3 0 0 0-2.83 4"></path>
							<path d="M14 12a4 4 0 0 1 0 8H6"></path>
							<line x1="4" x2="20" y1="12" y2="12"></line>
						</svg>
					</button> -->
					<button
						class="inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
						type="button"
						data-hs-editor-link=""
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
					<!-- <button
					class="inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
					type="button"
					data-hs-editor-ol=""
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
						<line x1="10" x2="21" y1="6" y2="6"></line>
						<line x1="10" x2="21" y1="12" y2="12"></line>
						<line x1="10" x2="21" y1="18" y2="18"></line>
						<path d="M4 6h1v4"></path>
						<path d="M4 10h2"></path>
						<path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
					</svg>
				</button> -->
					<button
						class="inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
						type="button"
						data-hs-editor-ul=""
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
	</div>

	<!-- Industry -->
	<div>
		<label for="industry" class="mb-2 block text-sm font-medium dark:text-white">Industry</label>
		<select
			bind:value={job.industry}
			id="industry"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
		>
			<option value="" disabled selected>Please select an industry</option>
			{#each Object.entries(INDUSTRIES) as industry}
				<option value={industry[1]}>{industry[0]}</option>
			{/each}
		</select>
	</div>

	<!-- Type -->
	<div>
		<label for="type" class="mb-2 block text-sm font-medium dark:text-white">Position Type</label>
		<select
			bind:value={job.type}
			id="type"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
		>
			<option value="" disabled selected>Please select an type</option>
			{#each Object.entries(JOB_TYPES) as type}
				<option value={type[1]}>{type[0]}</option>
			{/each}
		</select>
	</div>

	<!-- Job Status -->
	<div>
		<label for="status" class="mb-2 block text-sm font-medium dark:text-white">Position Type</label>
		<select
			bind:value={job.status}
			id="status"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
		>
			<option value="" disabled selected>Please select an status</option>
			{#each Object.entries(JOB_STATUSES) as status}
				<option value={status[1]}>{status[0]}</option>
			{/each}
		</select>
	</div>

	<!-- Application Link -->
	<div>
		<label for="applicationLink" class="mb-2 block text-sm font-medium dark:text-white"
			>Application Link</label
		>
		<input
			type="url"
			id="applicationLink"
			class="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="Application Link"
			aria-describedby="hs-input-helper-text"
			name="applicationLink"
			bind:value={job.applicationLink}
		/>
	</div>

	<button
		type="submit"
		class="focus:outline-hidden inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
	>
		{isLoading ? 'Loading...' : 'Submit'}
	</button>
</form>
