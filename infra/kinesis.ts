export const stream = new sst.aws.KinesisStream('mockIotStream');

// Create a function subscribing to events of `bar` type
stream.subscribe('subscriber.ar', {
	filters: [
		{
			data: {
				type: ['AR']
			}
		}
	]
});

export const apiFunction = new sst.aws.Function('ConsumerFunction', {
	handler: 'packages/functions/src/api.handler',
	link: [stream],
	permissions: [
		{
			actions: [
				'kinesis:SubscribeToShard',
				'kinesis:DescribeStream',
				'kinesis:ListStreams',
				'kinesis:GetRecords'
			],
			resources: [stream.arn]
		}
	],
	runtime: 'nodejs20.x'
});
