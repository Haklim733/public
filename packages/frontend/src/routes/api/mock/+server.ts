import { generateDroneTelemetryData } from '@mockIot/core/src/drone';
import { Resource } from 'sst';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
	const { duration, sessionId, service, speed } = await request.json();

	let topic = '';
	console.log(`smock/+server.ts: ${service}, ${sessionId}`);
	let longitude = -118.30049006438229;
	let latitude = 34.11844295532757;

	if (service === 'drone') {
		const startLocation = { latitude: latitude, longitude: longitude, altitude: 346 };
		const endLocation = {
			latitude: 34.16147041588432,
			longitude: -118.16762474718418,
			altitude: 20
		}; //rose bowl
		const altitude = 15;
		const device = 'drone';
		topic = `${Resource.App.name}/${Resource.App.stage}/iot/${sessionId}`;
		generateDroneTelemetryData(
			device,
			startLocation,
			endLocation,
			duration,
			speed,
			altitude,
			true,
			topic
		);
	}

	return new Response(JSON.stringify({ message: 'success' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
