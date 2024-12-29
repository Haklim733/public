import type { Handle } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const handle: Handle = async ({ event, resolve }) => {
	let STAGE = import.meta.env['VITE_STAGE'];
	event.locals.stage = STAGE;

	if (['.env', '/.git/config'].includes(event.url.pathname)) {
		const ipAddress = event.request.headers.get('X-Forwarded-For') || event.getClientAddress();
		console.log(ipAddress);

		return Promise.resolve(
			new Response('Not Found', {
				status: 404,
				headers: {
					'X-Robots-Tag': 'noindex, nofollow',
					'Content-Security-Policy': "default-src 'self';",
					'X-Frame-Options': 'DENY'
				}
			})
		);
	}

	let sessionId = event.cookies.get('access_token');
	let isAuthenticated = false;

	if (!sessionId) {
		let fullSessionId = uuidv4();
		sessionId = crypto.createHash('sha256').update(fullSessionId).digest('hex').slice(0, 16);
		console.log(sessionId);
		const myOptions = {
			maxAge: 60 * 60 * 1 * 1,
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			domain: ['dev', 'llee'].includes(STAGE) ? 'localhost' : import.meta.env['VITE_DOMAIN'],
			path: '/'
		};
		// @ts-ignore
		event.cookies.set('sessionId', sessionId, myOptions);
	}
	// @ts-ignore
	event.locals.user = {
		isAuthenticated: isAuthenticated,
		sessionId: sessionId,
		properties: {}
	};
	return resolve(event);
};
