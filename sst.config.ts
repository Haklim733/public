/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'viziot',
			removal: input.stage === 'prod' ? 'retain' : 'remove',
			home: 'aws',
			region: 'us-west-1',
			providers: {
				aws: {
					profile: input.stage === 'prod' ? 'myprod' : 'default'
				}
			}
		};
	},
	async run() {
		const rtServer = await import('./infra/realtime');
		const frontend = await import('./infra/frontend');
		return {
			app: frontend.site.url,
			rtEndPoint: rtServer.rtServer.endpoint,
			rtAuthorizer: rtServer.rtServer.authorizer
		};
	}
});
