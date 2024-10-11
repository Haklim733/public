// drone.test.ts
import { describe, expect, test } from 'bun:test';
import { calculatePath, genDroneTelemetry } from './drone';
import geolib from 'geolib';

test('update location', () => {
	const startLocation = { latitude: 37.7749, longitude: -122.4194 };
	const speed = 1000;
	const time = 1;
	const distance = speed * time;
	const bearing = 90;
	const newLocation = geolib.computeDestinationPoint(startLocation, distance, bearing);
	const distance2 = geolib.getDistance(startLocation, newLocation);
	console.log(`newLocation: ${JSON.stringify(newLocation)}`);
	console.log(`Distance: ${distance2} meters`);

	expect(Math.abs(distance - distance2)).toBeLessThanOrEqual(1); // expect distance to be close to 1000
});

// test('drone telemetry returns telemetry data for multiple waypoints', async () => {
// 	const startLocation = { latitude: 37.7749, longitude: -122.4194, altitude: 10 };
// 	const device = 'test';
// 	const speed = 100;
// 	const altitude = 15;
// 	const duration = 4;
// 	const distance = speed * duration; // meters
// 	const bearing = 90;

// 	const waypoint = geolib.computeDestinationPoint(startLocation, distance, bearing);
// 	const waypoint2 = geolib.computeDestinationPoint(startLocation, distance * 100, bearing);

// 	const waypoints = [waypoint, waypoint2];
// 	console.log(JSON.stringify(waypoint));
// 	console.log(JSON.stringify(waypoint2));

// 	const telemetryData = await genDroneTelemetry(
// 		device,
// 		waypoints,
// 		startLocation,
// 		duration,
// 		speed,
// 		altitude,
// 		false,
// 		''
// 	);

// 	expect(telemetryData).toBeUndefined(); // Note: generateDroneTelemetryData returns void
// });

// test('test that getRhumbLineBearing is similar', async () => {
// 	const startLocation = { latitude: 37.7749, longitude: -122.4194, altitude: 10 };
// 	const speed = 100;
// 	const duration = 3;
// 	const distance = speed * duration; // meters
// 	const endLoc = {
// 		latitude: 37.774407725758216,
// 		longitude: -122.07806993387254
// 	};

// 	const bearing = geolib.getRhumbLineBearing(startLocation, endLoc);
// 	console.log(`bearing: ${bearing}`);
// 	expect(bearing).toBeCloseTo(90, 0); //0.1 degree threshold
// });

test('get pathing telemetry data for multiple waypoint', async () => {
	const startLocation = { latitude: 37.7749, longitude: -122.4194 };
	const device = 'test';
	const speed = 100;
	const altitude = 15;
	const duration = 4;
	const distance = speed * duration; // meters
	const bearing = 90;
	const waypoint = geolib.computeDestinationPoint(startLocation, distance, bearing);
	const waypoint2 = geolib.computeDestinationPoint(startLocation, distance * 100, bearing);
	let droneSpeed = speed;

	const waypoints = [startLocation, waypoint, waypoint2];
	const res = await calculatePath(waypoints, speed);
	expect(res.length).toBeLessThanOrEqual(50);
});
