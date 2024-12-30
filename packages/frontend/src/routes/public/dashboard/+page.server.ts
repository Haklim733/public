import type { Actions, PageServerLoad } from './$types';
import { featureFlags } from '$lib/store';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	if (!featureFlags.private && ['dev', 'production'].includes(import.meta.env['VITE_STAGE'])) {
		throw redirect(302, '/');
	}

	return {};
};
