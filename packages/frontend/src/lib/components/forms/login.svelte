<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/schema';

	export let data: SuperValidated<Infer<typeof loginSchema>>;

	const form = superForm(data, {
		validators: zodClient(loginSchema),
		customValidity: true,
		validationMethod: 'onblur',
		multipleSubmits: 'prevent',
		scrollToError: 'auto',
		resetForm: true,
		applyAction: true,
		syncFlashMessage: true
	});
	const { form: formData, enhance } = form;
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<div class="w-96 rounded-md bg-white p-8 shadow-md">
		<h2 class="mb-4 text-2xl font-bold">Login</h2>
		<form method="POST" action="?/login" use:enhance>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label class="input-label">Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.Description />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label class="input-label">Password</Form.Label>
					<Input {...attrs} bind:value={$formData.password} />
				</Form.Control>
				<Form.Description />
			</Form.Field>
			<div class="mt-4 mt-4 flex flex-row items-center justify-center space-x-4">
				<Form.Button class="btn bg-[#594c5d] text-white" value="signin">Sign In</Form.Button>
				<Form.Button class="btn bg-[#594c5d] text-white" value="signup">Sign Up</Form.Button>
			</div>
		</form>
	</div>
</div>
