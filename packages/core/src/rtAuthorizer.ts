import { Resource } from 'sst';
import { realtime } from 'sst/aws/realtime';

export const handler = realtime.authorizer(async (token: string) => {
	// Validate the token
	const prefix = `${Resource.App.name}/${Resource.App.stage}/iot`;
	let isValid = true;
	console.log(token, Resource.RT_TOKEN.value);
	// const isValid = token === Resource.RT_TOKEN.value; //TODO: replace with real token, this one ends at the end of 2024
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
