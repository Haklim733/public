import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { iotFormSchema } from '@mockIot/core/src/iot.types';
import { zod } from 'sveltekit-superforms/adapters';
import { generateARVisionData } from '@mockIot/core/src/simulator';
import { Resource } from 'sst';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import { CognitoUserPoolClient } from '../../../../.sst/platform/src/components/aws/cognito-user-pool-client.js';

export const load = (async ({ locals }) => {
	const form = await superValidate(zod(iotFormSchema));

	// async function streamData() {
	// 	let resp = await fetch(`https://loripsum.net/generate.php?p=1&l=short`);
	// 	return await resp.text();
	// }
	// const [streamData] = await Promise.all([await streamData()]);

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	streamIot: async ({ request, fetch, locals }) => {
		const formData = await request.formData();
		const num = formData.get('number');
		const res = await fetch('/api/mock', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ num: num, service: 'iot' })
		});
		console.log(res);

		return {
			message: 'success',
			body: res
		};
	}
};
