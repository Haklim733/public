<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { startLocSchema, type StartLocFormSchema } from '@public/core/src/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<StartLocFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(startLocSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field name="longitude" class="width:50%;">
		<Form.Control let:attrs>
			<Form.Label>Starting Longitude</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.longitude}
				type="number"
				min="180"
				max="180"
				placeholder="Enter Starting Longitude"
			/>
			<!-- <Form.FieldErrors /> -->
		</Form.Control>
	</Form.Field>
	<Form.Field {form} name="latitude" class="width:50%;">
		<Form.Control let:attrs>
			<Form.Label>Starting Latitude</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.latitude}
				type="number"
				min="-90"
				max="90"
				placeholder="Enter Starting latitude"
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<!-- <Button on:click={changeStartLoc}>Update Start Location</Button> -->
</form>
