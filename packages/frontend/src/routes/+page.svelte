<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button/index.ts';
	import { featureFlags } from '$lib/store';

	const projects = [{ name: 'IoT', link: '/iot', description: 'Internet of Things project' }];
	if (!featureFlags.dashboard && !['dev', 'production'].includes(import.meta.env['VITE_STAGE'])) {
		projects.push({ name: 'Dashboard', link: '/dashboard', description: 'dashboard project' });
	}
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
