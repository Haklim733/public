import { KinesisClient, PutRecordCommand } from '@aws-sdk/client-kinesis';
import { message, superValidate } from 'sveltekit-superforms/server';

import type { PageServerLoad } from './$types';
import { iotFormSchema } from '@mockIot/core/src/iot.types';
import { zod } from 'sveltekit-superforms/adapters';
import { generateARVisionData } from '@mockIot/core/src/simulator';
import { Resource } from 'sst';

export const load = (async ({ locals }) => {
	const form = await superValidate(zod(iotFormSchema));

	async function streamData() {
		let resp = await fetch(`https://loripsum.net/generate.php?p=1&l=short`);
		return await resp.text();
	}
	const [streamData] = await Promise.all([await streamData()]);

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	streamIot: async ({ locals, request }) => {
		const formData = await request.formData();
		const client = new KinesisClient();
		let message = '';
		for (let i = 0; i <= formData.get('number'); i++) {
			let iotData: string = btoa(JSON.stringify(generateARVisionData(`device${i}`)));
			let buffer = Buffer.from(iotData, 'base64');
			let input = new PutRecordCommand({
				StreamName: Resource.mockIotStream.name,
				Data: new Uint8Array(buffer),
				PartitionKey: locals.user.sessionId!
			});
			await client
				.send(input)
				.then((data) => {})
				.catch((error) => {
					return { message: 'failed!' };
				})
				.finally(() => {
					message = `pushed telemetry to ${Resource.mockIotStream.name} using ;`;
				});
		}

		return {
			message: message
		};
	}
};
