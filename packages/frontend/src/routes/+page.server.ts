import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { iotFormSchema } from '@viziot/core/src/iot.types';
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
		stage: stage,
		publishEndpoint: '/api/mock'
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({}) => {
		return {
			message: 'success'
		};
	}
};
