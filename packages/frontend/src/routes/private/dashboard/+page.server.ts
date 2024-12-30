import type { PageServerLoad } from '../../dashboard/$types';
import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema, magiclinkSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { featureFlags } from '$lib/store';

export const load: PageServerLoad = async () => {
	if (!featureFlags.dashboard && ['dev', 'production'].includes(import.meta.env['VITE_STAGE'])) {
		throw redirect(302, '/');
	}
	let authenticated: boolean = false;

	return {
		formLogin: await superValidate(zod(loginSchema)),
		formMagicLink: await superValidate(zod(magiclinkSchema)),
		user: {
			authenticated: authenticated
		}
	};
};
