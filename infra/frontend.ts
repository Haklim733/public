import { rtServer, rtToken } from './realtime';

let domain = 'localhost';
let url = 'http://localhost:5173';
let supabaseUrl = 'http://localhost:54321';
let supbaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

if ($app.stage === 'production') {
	domain = 'public.iamlim.com';
	url = `https://${domain}`;
	supabaseUrl = 'https://tqoecbiwwhadcnjzxrwm.supabase.co';
	supbaseAnonKey =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxb2VjYml3d2hhZGNuanp4cndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTk4NzMsImV4cCI6MjA1MDgzNTg3M30.puxY7v27n3AejfRZmxU6kgfysv4H5XGV1og5cWVQ2KY';
}
if ($app.stage === 'dev') {
	domain = 'public.dev.iamlim.com';
	url = `https://${domain}`;
	supabaseUrl = 'https://tqoecbiwwhadcnjzxrwm.supabase.co';
	supbaseAnonKey =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxb2VjYml3d2hhZGNuanp4cndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTk4NzMsImV4cCI6MjA1MDgzNTg3M30.puxY7v27n3AejfRZmxU6kgfysv4H5XGV1og5cWVQ2KY';
}

if (!['dev', 'prduction'].includes($app.stage)) {
	// non dev or production
}

export const site = new sst.aws.SvelteKit('Public', {
	dev: {
		autostart: true
	},
	buildCommand: 'bun run build',
	domain: domain,
	environment: {
		VITE_STAGE: $app.stage,
		VITE_DOMAIN: domain,
		VITE_SUPABASE_URL: supabaseUrl,
		VITE_SUPABASE_ANON_KEY: supbaseAnonKey
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
