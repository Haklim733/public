<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.ts';
	import * as Dialog from '$lib/components/ui/dialog/index.ts';
	import * as Input from '$lib/components/ui/input/index.ts';
	import { Label } from '$lib/components/ui/label/index.ts';
	export let data = {};

	function clearRes() {
		data = {};
	}
</script>

<form on:submit|preventDefault={clearRes}>
	<Dialog.Root open={true}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Results</Dialog.Title>
				</Dialog.Header>
				{#each Object.entries(data) as [key, value]}
					<div class="flex items-center">
						<Label for={key} class="text-center">{key}: {value}</Label>
					</div>
				{/each}
			</Dialog.Content>
			<Dialog.Footer>
				<Button type="submit">Close</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</form>
