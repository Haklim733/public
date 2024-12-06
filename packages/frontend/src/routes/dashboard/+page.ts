import type { PageLoad } from './$types.ts';

export const load: PageLoad = async () => {
	return {
		title: 'Dashboard Example'
	};
};
