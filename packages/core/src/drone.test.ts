// drone.test.ts
import { expect, test } from 'bun:test';
import { generateDroneTelemetryData } from './drone';

test('generateDroneTelemetryData returns telemetry data', () => {
	const startLocation = { latitude: 37.7749, longitude: -122.4194, altitude: 10 };
	const endLocation = { latitude: 37.7859, longitude: -122.4364, altitude: 20 };
	const numPoints = 11;
	const speed = 5;
	const altitude = 15;
	const device = 'test';

	const telemetryData = generateDroneTelemetryData(
		device,
		startLocation,
		endLocation,
		numPoints,
		speed,
		altitude
	);

	expect(telemetryData).toBeInstanceOf(Array);
	expect(telemetryData.length).toBe(numPoints);
	expect(telemetryData[0].latitude).toBeCloseTo(startLocation.latitude);
	expect(telemetryData[0].longitude).toBeCloseTo(startLocation.longitude);
	// expect(telemetryData[0].altitude).toBeCloseTo(startLocation.altitude);
});

test('generateDroneTelemetryData throws error for invalid input', () => {
	const startLocation = { latitude: 37.7749, longitude: -122.4194, altitude: 10 };
	const endLocation = { latitude: 37.7859, longitude: -122.4364, altitude: 20 };
	const numPoints = -1;
	const speed = 5;
	const altitude = 15;
	const device = 'test';

	expect(() =>
		generateDroneTelemetryData(device, startLocation, endLocation, numPoints, speed, altitude)
	).toThrowError();
});
