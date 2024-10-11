// drone.test.ts
import { describe, expect, test } from 'bun:test';
import { genDroneTelemetry } from './drone';
import geolib from 'geolib';

test('update location', async () => {
	const startLocation = { latitude: 37.7749, longitude: -122.4194 };
	const speed = 1000;
	const time = 1;
	const distance = speed * time;
	const bearing = 90;
	const newLocation = geolib.computeDestinationPoint(startLocation, distance, bearing);
	const distance2 = geolib.getDistance(startLocation, newLocation);
	console.log(`Distance: ${JSON.stringify(newLocation)} meters`);
	console.log(`Distance: ${distance2} meters`);

	expect(distance).toBeCloseTo(speed * time, 0); // expect distance to be close to 1000
});

test('generateDroneTelemetryData returns telemetry data for a single waypoint', async () => {
	const startLocation = { latitude: 37.7749, longitude: -122.4194, altitude: 10 };
	const device = 'test';
	const speed = 100;
	const altitude = 15;
	const duration = 3;
	const distance = speed * duration; // meters
	const bearing = 90;

	const waypoint = geolib.computeDestinationPoint(startLocation, distance, bearing);

	const waypoints = [waypoint];
	console.log(waypoint);

	const telemetryData = await genDroneTelemetry(
		device,
		waypoints,
		startLocation,
		duration,
		speed,
		altitude,
		false,
		''
	);

	expect(telemetryData).toBeUndefined(); // Note: generateDroneTelemetryData returns void
});
