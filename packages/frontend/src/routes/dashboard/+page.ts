// +page.ts
import type { PageLoad } from './$types.ts';

export const load: PageLoad = async ({ data }) => {
	return {
		title: 'Dashboard Example',
		user: {
			authenticated: data.user.authenticated
		}
	};
};
