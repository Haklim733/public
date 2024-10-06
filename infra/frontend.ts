import { stream } from './kinesis';
import { rtServer, rtToken } from './realtime';

export const site = new sst.aws.SvelteKit('MockIotSite', {
	dev: {
		autostart: true
	},
	buildCommand: 'bun run build',
	environment: {
		VITE_STAGE: $app.stage,
		VITE_DOMAIN: $app.stage === 'prod' ? 'iot.iamlim.com' : 'iot.dev.iamlim.com'
	},
	link: [stream, rtServer, rtToken],
	path: 'packages/frontend',
	permissions: [
		{
			actions: ['iot:Publish', 'iot:Subscribe'],
			resources: ['*']
		}
	],
	server: {
		memory: '512 MB'
	}
});
