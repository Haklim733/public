/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'mockIot',
			removal: input?.stage === 'prod' ? 'retain' : 'remove',
			home: 'aws',
			region: 'us-west-1'
		};
	},
	async run() {
		console.log($app.stage);
		const api = await import('./infra/api');
		const frontend = await import('./infra/frontend');
		const stream = await import('./infra/kinesis');
		return {
			app: frontend.site.url,
			stream: stream.stream.name
		};
	}
});
