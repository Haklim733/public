import type { Actions } from './$types';
import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data } = await supabase.from('users').select();
	return {
		users: data ?? []
	};
}

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
