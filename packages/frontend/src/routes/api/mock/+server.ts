import { generateDroneTelemetryData } from '@mockIot/core/src/drone';
import { Resource } from 'sst';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
	const { duration, sessionId, service } = await request.json();

	let topic = '';
	console.log(`smock/+server.ts: ${service}, ${sessionId}`);

	if (service === 'drone') {
		const startLocation = { latitude: 34.1186197, longitude: -118.30813539, altitude: 346 };
		const endLocation = { latitude: 34.16242, longitude: -118.16787, altitude: 20 };
		const speed = 100; //meter per second
		const altitude = 15;
		const device = 'mockIot';
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
