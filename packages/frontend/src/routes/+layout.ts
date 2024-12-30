import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */
	depends('supabase:auth');
	let supabaseUrl = import.meta.env['VITE_SUPABASE_URL'];
	let supabaseKey = import.meta.env['VITE_SUPABASE_ANON_KEY'];

	const supabase = isBrowser()
		? createBrowserClient(supabaseUrl, supabaseKey, {
				global: {
					fetch
				}
			})
		: createServerClient(supabaseUrl, supabaseKey, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	console.log(session, user);
	return { session, supabase, user };
};
