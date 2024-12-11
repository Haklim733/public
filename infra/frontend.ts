import { rtServer, rtToken } from './realtime';

let domain = 'localhost';
let url = 'http://localhost:5173';
if ($app.stage === 'production') {
	domain = 'public.iamlim.com';
	url = `https://${domain}`;
}
if ($app.stage === 'dev') {
	domain = 'public.dev.iamlim.com';
	url = `https://${domain}`;
}

export const site = new sst.aws.SvelteKit('Public', {
	dev: {
		autostart: true
	},
	buildCommand: 'bun run build',
	domain: domain,
	environment: {
		VITE_STAGE: $app.stage,
		VITE_DOMAIN: domain
	},
	link: [rtServer, rtToken],
	path: 'packages/frontend',
	permissions: [
		{
			actions: ['iot:Publish', 'iot:Subscribe', 'iot:Connect', 'iot:Receive'],
			resources: ['*']
		}
	],
	transform: {
		server: {
			memory: '256 MB'
		}
	}
});
// const exposeHeaders = [
// 	'Date',
// 	'Keep-Alive',
// 	'X-Custom-Header',
// 	'X-Amz-Request-Id',
// 	'Content-Type',
// 	'Content-Length',
// 	'Access-Control-Allow-Origin'
// ];
// const allowHeaders = [
// 	'Content-Type',
// 	'Origin',
// 	'Expires',
// 	'Accept',
// 	'X-Requested-With',
// 	'Cache-Control',
// 	'Access-Control-Allow-Origin'
// ];

// export const apiFunction = new sst.aws.Function('MyApiFunction', {
// 	handler: 'packages/core/src/api.handler',
// 	url: {
// 		cors: {
// 			allowMethods: ['GET', 'HEAD'],
// 			allowOrigins: [url],
// 			exposeHeaders: exposeHeaders,
// 			allowHeaders: allowHeaders
// 		}
// 	},
// 	link: [],
// 	permissions: [
// 		{
// 			actions: [
// 				's3:GetObject',
// 				's3:PutObject',
// 				's3:DeleteObject',
// 				's3:ListBucket',
// 				's3:List*',
// 				'iot:Publish',
// 				'iot:Subscribe'
// 			],
// 			resources: ['*']
// 		}
// 	],
// 	runtime: 'nodejs20.x'
// });
