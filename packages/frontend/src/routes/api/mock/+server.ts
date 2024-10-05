import { KinesisClient, PutRecordCommand } from '@aws-sdk/client-kinesis';
import { generateARVisionData } from '@mockIot/core/src/simulator';
import { Resource } from 'sst';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, locals }: RequestEvent) {
	const { num, service } = await request.json();
	const sessionId = locals.user.sessionId;
	console.log(sessionId);
	console.log(Resource.RT_TOKEN.value);

	const kenisisClient = new KinesisClient();
	const iotClient = new IoTDataPlaneClient();
	let topic = '';

	for (let i = 0; i <= num; i++) {
		if (service === 'iot') {
			topic = `${Resource.App.name}/${Resource.App.stage}/iot/${sessionId}`;
			const payload = generateARVisionData(`mockIot-${i}`);
			await iotClient.send(
				new PublishCommand({
					payload: Buffer.from(JSON.stringify(payload)),
					topic: topic
				})
			);
		} else if (service === 'kinesis') {
			let iotData: string = btoa(JSON.stringify(generateARVisionData(`device${i}`)));
			let buffer = Buffer.from(iotData, 'base64');
			topic = sessionId;
			let input = new PutRecordCommand({
				StreamName: Resource.mockIotStream.name,
				Data: new Uint8Array(buffer),
				PartitionKey: topic
			});
			await kenisisClient
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

	return new Response(JSON.stringify({ topic: topic }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
