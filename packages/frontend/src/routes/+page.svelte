<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button/index.ts';

	const projects = [
		{ name: 'IoT', link: '/iot', description: 'Internet of Things project' },
		{ name: 'Dashboard', link: '/dashboard', description: 'dashboard project' }
	];
</script>

{#each projects as { name, link, description }}
	<Card.Root>
		<Card.Header>
			<Button href={link}>
				<Card.Title>{name}</Card.Title>
				<Card.Description>{description}</Card.Description>
			</Button>
		</Card.Header>
	</Card.Root>
{/each}
