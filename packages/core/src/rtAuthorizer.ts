import { Resource } from 'sst/aws';
import { realtime } from 'sst/aws/realtime';

export const handler = realtime.authorizer(async (token) => {
	// Validate the token
	const prefix = `${Resource.App.name}/${Resource.App.stage}/iot`;
	const isValid = token === Resource.RT_TOKEN.value; //TODO: replace with real token, this one ends at the end of 2024
	console.log(`isValid: ${isValid}, prefix: ${prefix}`);

	return isValid
		? {
				publish: [`${prefix}/*`],
				subscribe: [`${prefix}/*`]
			}
		: {
				publish: []
			};
});
