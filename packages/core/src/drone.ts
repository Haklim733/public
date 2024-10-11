import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import geolib from 'geolib';

const iotClient = new IoTDataPlaneClient({});
export interface DroneTelemetryData {
	device: string;
	timestamp: number;
	latitude: number;
	longitude: number;
	altitude: number;
	accelerationX: number;
	accelerationY: number;
	accelerationZ: number;
	roll: number;
	pitch: number;
	yaw: number;
	batteryVoltage: number;
	batteryCurrent: number;
}

interface PathPoint {
	latitude: number;
	longitude: number;
}

export async function genDroneTelemetry(
	device: string,
	waypoints: PathPoint[],
	startLocation: PathPoint,
	duration: number, // in seconds
	speed: number,
	altitude: number,
	push: boolean = false,
	topic: string
): Promise<void> {
	let currentLocation = startLocation;
	let initialTimestamp = Date.now();
	let currentWaypointIndex = 0;
	let timeElapsed = 0;
	let data: DroneTelemetryData[] = [];
	let currentTimestamp;

	if (waypoints.length === 0) {
		throw new Error('Waypoints array cannot be empty');
	}
	const threshold = 0.1;
	let i = 0;

	while (timeElapsed < duration && i < waypoints.length) {
		i++;

		const waypoint = waypoints[currentWaypointIndex];
		let distanceToWaypoint = geolib.getDistance(currentLocation, waypoint);

		while (distanceToWaypoint > threshold) {
			const randomTimeout = getRandomInt(1000, 2000);
			await new Promise((resolve) => setTimeout(resolve, randomTimeout));
			currentTimestamp = Date.now();
			timeElapsed = (initialTimestamp - currentTimestamp) / 1000;

			// Update current location
			distanceToWaypoint = geolib.getDistance(currentLocation, waypoint);
			let bearing = geolib.getRhumbLineBearing(currentLocation, waypoint);
			currentLocation = geolib.computeDestinationPoint(
				currentLocation,
				distanceToWaypoint,
				bearing
			);
			console.log(`Time Elapsed: ${timeElapsed}`);
			console.log(`current location: ${JSON.stringify(currentLocation)}`);

			// Update distance to waypoint
			distanceToWaypoint = geolib.getDistance(currentLocation, waypoint);
			console.log(`distance to waypoint ${JSON.stringify(waypoint)}: ${distanceToWaypoint}`);
		}

		const telemetryData: DroneTelemetryData = {
			device,
			timestamp: currentTimestamp!,
			latitude: currentLocation.latitude,
			longitude: currentLocation.longitude,
			altitude,
			accelerationX: 0,
			accelerationY: 0,
			accelerationZ: 0,
			roll: 0,
			pitch: 0,
			yaw: 0,
			batteryVoltage: 12,
			batteryCurrent: 1
		};

		if (push) {
			let res = iotClient.send(
				new PublishCommand({
					payload: Buffer.from(JSON.stringify(telemetryData)),
					topic: topic,
					qos: 1
				})
			);
		}

		data.push(telemetryData);

		// Check if current location is close enough to waypoint
		if (distanceToWaypoint <= threshold) {
			currentWaypointIndex++;
		}

		// update Timestamp
	}
}

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
