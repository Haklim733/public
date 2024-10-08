<script lang="ts">
	import { messages } from '$lib/store';
	import { VisXYContainer, VisLine, VisAxis } from '@unovis/svelte';
	import type { DroneTelemetryData } from '@mockiot/core/src/drone';

	let chartData: DroneTelemetryData[] = [];
	const x = (d: DroneTelemetryData) => d.timestamp;
	const y = (d: DroneTelemetryData) => d.altitude;

	$: {
		messages.subscribe((message) => {
			chartData = message.map((record) => ({
				timestamp: record.timestamp,
				altitude: record.altitude
			}));
		});
		console.log(chartData);
	}
	function clearVizData() {
		chartData = [];
	}

	export { clearVizData };
</script>

<VisXYContainer data={chartData}>
	<VisLine {x} {y} />
</VisXYContainer>
