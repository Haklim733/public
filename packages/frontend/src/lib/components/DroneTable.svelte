<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { DroneTelemetry } from '@public/core/src/drone';

	export let telemetryData: DroneTelemetry[] = [];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<!-- <Table.Head>Device</Table.Head> -->
			<Table.Head>Timestamp</Table.Head>
			<Table.Head>Latitude</Table.Head>
			<Table.Head>Longitude</Table.Head>
			<Table.Head>Altitude</Table.Head>
			<!-- <Table.Head>Acceleration X</Table.Head>
			<Table.Head>Acceleration Y</Table.Head>
			<Table.Head>Acceleration Z</Table.Head>
			<Table.Head>Roll</Table.Head>
			<Table.Head>Pitch</Table.Head>
			<Table.Head>Yaw</Table.Head>
			<Table.Head>Battery Voltage</Table.Head>
			<Table.Head>Battery Current</Table.Head> -->
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each telemetryData as telemetry}
			<Table.Row>
				<!-- <Table.Cell>{telemetry.device}</Table.Cell> -->
				<Table.Cell>{telemetry.timestamp}</Table.Cell>
				<Table.Cell>{telemetry.latitude}</Table.Cell>
				<Table.Cell>{telemetry.longitude}</Table.Cell>
				<Table.Cell>{telemetry.altitude}</Table.Cell>
				<!-- <Table.Cell>{telemetry.accelerationX}</Table.Cell>
				<Table.Cell>{telemetry.accelerationY}</Table.Cell>
				<Table.Cell>{telemetry.accelerationZ}</Table.Cell>
				<Table.Cell>{telemetry.roll}</Table.Cell>
				<Table.Cell>{telemetry.pitch}</Table.Cell>
				<Table.Cell>{telemetry.yaw}</Table.Cell>
				<Table.Cell>{telemetry.batteryVoltage}</Table.Cell>
				<Table.Cell>{telemetry.batteryCurrent}</Table.Cell> -->
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
