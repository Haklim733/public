import { genDroneTelemetry } from '@viziot/core/src/drone';
import { Resource } from 'sst';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
	const { startLocation, waypoints, sessionId, service, speed } = await request.json();
	console.log(startLocation);

	let topic = '';
	console.log(`smock/+server.ts: ${service}, ${sessionId}`);

	if (service === 'drone') {
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
