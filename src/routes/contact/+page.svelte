<script lang="ts">
	import { createForm } from 'felte'
	import { validator } from '@felte/validator-zod'
	import * as zod from 'zod'

	let status = $state<'IDLE' | 'LOADING' | 'SUCCESSFUL' | 'ERROR'>('IDLE')

	const schema = zod.object({
		firstName: zod.string().nonempty(),
		lastName: zod.string().nonempty(),
		email: zod.string().email().nonempty(),
		business: zod.string().optional(),
		message: zod.string().nonempty()
	})

	const { form, errors, warnings, isValid } = createForm({
		extend: validator({ schema }),
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			business: '',
			message: ''
		},
		onSubmit: async (values, context) => {
			status = 'LOADING'
			try {
				if (!isValid) {
					throw new Error('Validation issue')
				}
				const response = await fetch('/contact', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(values)
				})

				if (response.status !== 201) {
					throw new Error(`Error submitting`)
				}

				return await response.json()
			} catch (err) {
				throw new Error(err)
			}
		},
		onSuccess(response, context) {
			context.reset()
			status = 'SUCCESSFUL'
		},
		onError(err, context) {
			status = 'ERROR'
		}
	})
</script>

<h1>Contact us page</h1>

{#if status === 'LOADING'}
	Loading...
{/if}

{#if status === 'SUCCESSFUL'}
	Successful!
{/if}

{#if status === 'ERROR'}
	Error with form
{/if}

<form use:form>
	<input name="firstName" type="text" />
	{#if $errors.firstName}
		{$errors.firstName}
	{/if}
	<input name="lastName" type="text" />

	<input name="email" type="email" />
	{#if $errors.email}
		{$errors.email}
	{/if}

	<input name="businessName" type="text" />

	<textarea name="message"></textarea>

	<button type="submit">Submit</button>
</form>
