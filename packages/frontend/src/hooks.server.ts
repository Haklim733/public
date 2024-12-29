import { type Handle, redirect } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { sequence } from '@sveltejs/kit/hooks';

const supabase: Handle = async ({ event, resolve }) => {
	let STAGE = import.meta.env['VITE_STAGE'];
	event.locals.stage = STAGE;

	if (['.env', '/.git/config', 'ads.txt', 's3cmd.ini'].includes(event.url.pathname)) {
		const ipAddress = event.request.headers.get('X-Forwarded-For') || event.getClientAddress();
		console.log(ipAddress);

		return Promise.resolve(
			new Response('Forbidden', {
				status: 403,
				headers: {
					'X-Robots-Tag': 'noindex, nofollow',
					'Content-Security-Policy': "default-src 'self';",
					'X-Frame-Options': 'DENY'
				}
			})
		);
	}
	let supabaseUrl = import.meta.env['SUPABASE_URL'];
	let supabaseKey = import.meta.env['SUPABASE_ANON_KEY'];

	event.locals.supabase = createServerClient(supabaseUrl, supabaseKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet: { name: string; value: string; options: any }[]) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (!event.locals.session && event.url.pathname.startsWith('/private')) {
		redirect(303, '/auth');
	}

	if (event.locals.session && event.url.pathname === '/auth') {
		redirect(303, '/private');
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
