import type { Actions, PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { userInsertSchema } from '@public/core/db/schema';

export const load: PageServerLoad = async () => {
	let authenticated: boolean = false;
	// const { data } = await supabase.from('users').select();

	return {
		form: await superValidate(zod(userInsertSchema)),
		user: {
			authenticated: authenticated
		}
	};
};

export const actions: Actions = {
	auth: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const action = data.get('action') as string;
		const res = await supabase.from('users').select();

		if (res.error && action === 'signin') {
			return { success: false, message: 'Could not find you. Please SignUp' };
		} else if (res.error && action === 'signup') {
		}
		if (!res.error && action === 'signup') {
			return { success: true, message: 'SignUp successful!' };
		}
	}
};
