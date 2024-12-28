<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { usersInsertSchema } from '@public/db/schema';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: usersInsertSchema.parse(data),
		customValidity: true,
		validationMethod: 'onblur',
		multipleSubmits: 'prevent',
		scrollToError: 'auto',
		resetForm: true,
		applyAction: true,
		onUpdate: ({ form, result }) => {},
		syncFlashMessage: true
	});
	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/signup" use:enhance>
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label class="input-label">Username</Form.Label>
			<Input {...attrs} bind:value={$formData.username} />
		</Form.Control>
		<Form.Description />
	</Form.Field>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label class="input-label">Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.Description />
	</Form.Field>
	<div class="flex flex-row items-center justify-center">
		<Form.Button class="btn bg-[#594c5d] text-white">Submit</Form.Button>
	</div>
</form>
