import { KinesisClient, PutRecordCommand } from '@aws-sdk/client-kinesis';
import { generateARVisionData } from '@mockIot/core/src/simulator';
import { Resource } from 'sst';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import type { RequestEvent } from '@sveltejs/kit';
import mqtt from 'mqtt';

let endpoint = Resource.IotServer.endpoint;
let authorizer = Resource.IotServer.authorizer;

const iotClient = new IoTDataPlaneClient({});

export async function POST({ request }: RequestEvent) {
	const { num, service, sessionId } = await request.json();
	console.log(endpoint);

	let topic = '';
	let client = mqtt.connect(`wss://${endpoint}/mqtt?x-amz-customauthorizer-name=${authorizer}`, {
		protocolVersion: 5,
		manualConnect: true,
		username: '', // Must be empty
		password: Resource.RT_TOKEN.value,
		clientId: sessionId
	});

	for (let i = 0; i <= num; i++) {
		if (service === 'iot') {
			topic = `${Resource.App.name}/${Resource.App.stage}/iot/${sessionId}`;
			const payload = generateARVisionData(`mockIot-${i}`);
			client!.publish(topic, JSON.stringify(payload));
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
