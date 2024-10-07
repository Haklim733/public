import { KinesisClient, PutRecordCommand } from '@aws-sdk/client-kinesis';
import { generateDroneTelemetryData } from '@mockIot/core/src/drone';
import { Resource } from 'sst';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import type { RequestEvent } from '@sveltejs/kit';

const iotClient = new IoTDataPlaneClient({});

export async function POST({ request }: RequestEvent) {
	const { devices, sessionId, service } = await request.json();

	let topic = '';
	console.log(`smock/+server.ts: ${devices}, ${service}, ${sessionId}`);

	for (let i = 0; i <= devices; i++) {
		if (service === 'iot') {
			topic = `${Resource.App.name}/${Resource.App.stage}/iot/test`;
			console.log(topic);
			const payload = generateDroneTelemetryData(`mockIot-${i}`);
			// client!.publish(topic, JSON.stringify(payload));
			let res = await iotClient.send(
				new PublishCommand({
					payload: Buffer.from(JSON.stringify(payload)),
					topic: topic
				})
			);
			console.log(await res);
		} else if (service === 'kinesis') {
			let iotData: string = btoa(JSON.stringify(generateARVisionData(`device${i}`)));
			let buffer = Buffer.from(iotData, 'base64');
			topic = sessionId;
			let input = new PutRecordCommand({
				StreamName: Resource.mockIotStream.name,
				Data: new Uint8Array(buffer),
				PartitionKey: topic
			});
			await kenesisClient
				.send(input)
				.then((data) => {})
				.catch((error) => {
					return { message: 'failed!' };
				})
				.finally(() => {
					message = `pushed telemetry to ${Resource.mockIotStream.name} using ;`;
				});
		}
	}

	return new Response(JSON.stringify({ message: 'success' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
