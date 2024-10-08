<script lang="ts">
	import { messages } from '$lib/store';
	import { VisXYContainer, VisLine, VisAxis } from '@unovis/svelte';
	import type { DroneTelemetryData } from '@mockiot/core/src/drone';

	let chartData: DroneTelemetryData[] = [];

	$: {
		messages.subscribe((message) => {
			chartData = message.map((record) => ({
				x: record.timestamp,
				y: record.altitude
			}));
		});
	}
</script>

<VisXYContainer>
	<VisLine {chartData} x={(d) => d.timestamp} y={(d) => d.altitude} />
	<VisAxis type="x" />
	<VisAxis type="y" />
</VisXYContainer>
