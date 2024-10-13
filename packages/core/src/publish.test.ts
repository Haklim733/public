import { generateARVisionData } from '@viziot/core/src/ar';
import { Resource } from 'sst';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import mqtt from 'mqtt';

const iotClient = new IoTDataPlaneClient({});

test('test publish mqt', async () => {
	let topic = '';

	topic = `${Resource.App.name}/${Resource.App.stage}/iot/test`;
	console.log(topic);
	const payload = generateARVisionData(`VizIot-test`);
	// client!.publish(topic, JSON.stringify(payload));
	let res = await iotClient.send(
		new PublishCommand({
			payload: Buffer.from(JSON.stringify(payload)),
			topic: topic
		})
	);
	console.log(await res);
});
