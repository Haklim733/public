import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { iotFormSchema } from '@mockIot/core/src/iot.types';
import { zod } from 'sveltekit-superforms/adapters';
import { Resource } from 'sst';

export const load = (async ({ fetch, locals }) => {
	const form = await superValidate(zod(iotFormSchema));
	const endpoint = Resource.IotServer.endpoint;
	const authorizer = Resource.IotServer.authorizer;
	const token = Resource.RT_TOKEN.value;
	const appName = Resource.App.name;
	const stage = Resource.App.stage;

	return {
		form,
		sessionId: locals.user.sessionId,
		endpoint: endpoint,
		authorizer: authorizer,
		token: token,
		appName: appName,
		stage: stage
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
			body: JSON.stringify({ num: num, service: 'iot', sessionId: locals.user.sessionId })
		});
		console.log(res);

		return {
			message: 'success'
		};
	}
};
