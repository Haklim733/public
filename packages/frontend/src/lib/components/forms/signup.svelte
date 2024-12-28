<script lang="ts">
	import type { PageData } from './$types';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type InsertUser, userInsertSchema } from '@public/core/db/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<typeof InsertUser>>;

	const form = superForm(data, {
		validators: zodClient(userInsertSchema),
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

<div class="flex h-screen flex-col items-center justify-center">
	<div class="w-96 rounded-md bg-white p-8 shadow-md">
		<h2 class="mb-4 text-2xl font-bold">Sign Up</h2>
		<form method="POST" action="?/auth" use:enhance>
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
			<div class="mt-4 flex flex-row items-center justify-center">
				<Form.Button class="btn bg-[#594c5d] text-white" value="signin">Sign In</Form.Button>
				<Form.Button class="btn bg-[#594c5d] text-white" value="signup">Sign Up</Form.Button>
			</div>
		</form>
	</div>
</div>
