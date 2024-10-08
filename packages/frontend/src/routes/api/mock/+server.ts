import { KinesisClient, PutRecordCommand } from '@aws-sdk/client-kinesis';
import { generateDroneTelemetryData } from '@mockIot/core/src/drone';
import { Resource } from 'sst';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
	const { sessionId, service } = await request.json();

	let topic = '';
	console.log(`smock/+server.ts: ${service}, ${sessionId}`);

	if (service === 'drone') {
		const startLocation = { latitude: 34.1186197, longitude: -118.30813539, altitude: 346 };
		const endLocation = { latitude: 34.16242, longitude: -118.16787, altitude: 20 };
		const numPoints = 11;
		const speed = 5; //meter per second
		const altitude = 15;
		const device = 'mockIot';
		topic = `${Resource.App.name}/${Resource.App.stage}/iot/${sessionId}`;
		generateDroneTelemetryData(
			device,
			startLocation,
			endLocation,
			numPoints,
			speed,
			altitude,
			true,
			topic
		);
	} else if (service === 'kinesis') {
		// 	let iotData: string = btoa(JSON.stringify(generateARVisionData(`device${i}`)));
		// 	let buffer = Buffer.from(iotData, 'base64');
		// 	topic = sessionId;
		// 	let input = new PutRecordCommand({
		// 		StreamName: Resource.mockIotStream.name,
		// 		Data: new Uint8Array(buffer),
		// 		PartitionKey: topic
		// 	});
		// 	await kenesisClient
		// 		.send(input)
		// 		.then((data) => {})
		// 		.catch((error) => {
		// 			return { message: 'failed!' };
		// 		})
		// 		.finally(() => {
		// 			message = `pushed telemetry to ${Resource.mockIotStream.name} using ;`;
		// 		});
		// }
	}

	return new Response(JSON.stringify({ message: 'success' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
