<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import CircleHelp from 'lucide-svelte/icons/circle-help';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	export let message: string = '';
	export let displayText: string = '';
</script>

<Dialog.Root>
	{displayText}
	<Dialog.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
		<CircleHelp color="black" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title style={`color: var(--mustard)`}>Instructions</Dialog.Title>
			<Dialog.Description style={`color: var(--fig); font-weight: 600;`}>
				{message}
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
