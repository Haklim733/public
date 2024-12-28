import type { Actions, PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { userInsertSchema } from '@public/core/db/schema';

export const load: PageServerLoad = async () => {
	const { data } = await supabase.from('users').select();
	let authenticated: boolean = false;

	const form = await superValidate(zod(userInsertSchema));

	return {
		user: {
			authenticated: authenticated
		}
	};
};

export const actions: Actions = {
	signUp: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const { user, error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, user };
	},
	login: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const { user, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, user };
	}
};
