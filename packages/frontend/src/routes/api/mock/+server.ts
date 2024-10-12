import { genDroneTelemetry } from '@mockIot/core/src/drone';
import { Resource } from 'sst';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
	const { waypoints, sessionId, service, speed } = await request.json();

	let topic = '';
	console.log(`smock/+server.ts: ${service}, ${sessionId}`);
	let longitude = -118.30049006438229;
	let latitude = 34.11844295532757;

	if (service === 'drone') {
		const startLocation = { latitude: latitude, longitude: longitude, altitude: 346 };
		const altitude = 15;
		const duration = 20;
		const device = service;
		topic = `${Resource.App.name}/${Resource.App.stage}/iot/${sessionId}`;
		const res = await genDroneTelemetry(
			device,
			waypoints,
			startLocation,
			duration,
			speed,
			altitude,
			true,
			topic
		);
		return new Response(JSON.stringify({ message: 'success', data: res }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	return new Response(JSON.stringify({ message: 'no such service', time: '' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
