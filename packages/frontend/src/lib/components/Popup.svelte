<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.ts';
	import * as Dialog from '$lib/components/ui/dialog/index.ts';
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
				<div class="results">
					{#each Object.entries(data) as [key, value]}
						<p>{key}: {value}</p>
					{/each}
				</div>
			</Dialog.Content>
			<Dialog.Footer>
				<Button type="submit">Close</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</form>
