import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { iotFormSchema, startLocSchema } from '@public/core/src/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { Resource } from 'sst';

export const load: PageServerLoad = async ({ locals }) => {
	const droneForm = await superValidate(zod(iotFormSchema));
	const startLocForm = await superValidate(zod(startLocSchema));
	const endpoint = Resource.IotServer.endpoint;
	const authorizer = Resource.IotServer.authorizer;
	const token = Resource.RT_TOKEN.value;
	const appName = Resource.App.name;
	const stage = Resource.App.stage;
	// @ts-ignore
	const sessionId = locals.user.sessionId!;

	return {
		droneForm,
		startLocForm,
		sessionId: sessionId,
		endpoint: endpoint,
		authorizer: authorizer,
		token: token,
		appName: appName,
		stage: stage,
		publishEndpoint: '/api/mock'
	};
};

export const actions = {
	default: async ({}) => {
		return {
			message: 'success'
		};
	}
};
