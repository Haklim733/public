import type { Handle } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

let STAGE = import.meta.env.VITE_STAGE;

export const handle: Handle = async ({ event, resolve }) => {
	let sessionId = event.cookies.get('sessionId');
	let isAuthenticated = false;

	if (!sessionId) {
		sessionId = uuidv4();
		const myOptions = {
			maxAge: 60 * 60 * 1 * 1, //60 sec * 60 minutes * 1 hour * 1 day
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			domain: STAGE === 'dev' ? 'localhost:5173' : import.meta.env.VITE_DOMAIN,
			path: '/'
		};
		// @ts-ignore
		event.cookies.set('sessionId', sessionId, myOptions);
	}

	event.locals.user = {
		isAuthenticated: isAuthenticated,
		sessionId: sessionId,
		properties: {}
	};
	return resolve(event);
};
