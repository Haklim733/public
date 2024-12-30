import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/server';
import { loginSchema, magiclinkSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { featureFlags } from '$lib/store';

export const load: PageServerLoad = async () => {
	if (!featureFlags.private && ['dev', 'production'].includes(import.meta.env['VITE_STAGE'])) {
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

export const actions: Actions = {
	login: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(loginSchema));
		if (!form.valid) return fail(400, { form });

		const email = form.data.email;
		const password = form.data.password;

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/private');
		}
	},
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signUp({ email, password });
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/');
		}
	},
	magiclink: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(loginSchema));
		if (!form.valid) return fail(400, { form });
		const email = form.data.email;

		const { data, error } = await supabase.auth.signInWithOtp({
			email: email,
			options: {
				// set this to false if you do not want the user to be automatically signed up
				shouldCreateUser: false,
				emailRedirectTo: '/'
			}
		});
		return message(form, 'Form posted successfully!');
	}
};
