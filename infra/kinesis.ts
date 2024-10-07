export const stream = new sst.aws.KinesisStream('mockIotStream');

stream.subscribe('./packages/core/src/subscriber.filtered', {
	filters: [
		{
			data: {
				type: ['AR']
			}
		}
	]
});

export const apiFunction = new sst.aws.Function('ConsumerFunction', {
	handler: 'packages/core/src/api.handler',
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
