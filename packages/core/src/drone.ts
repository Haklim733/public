import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';

const iotClient = new IoTDataPlaneClient({});
export interface DroneTelemetryData {
	device: string;
	timestamp: number;
	latitude: number;
	longitude: number;
	altitude: number;
	velocityX: number;
	velocityY: number;
	velocityZ: number;
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
	altitude: number; //meters
}

export async function generateDroneTelemetryData(
	device: string,
	startLocation: PathPoint,
	endLocation: PathPoint,
	duration: number, // in seconds
	speed: number,
	altitude: number,
	push: boolean = false,
	topic: string
): Promise<void> {
	const direction = getDirection(startLocation, endLocation);
	const velocityX = speed * Math.cos(direction);
	const velocityY = speed * Math.sin(direction);

	let currentLocation = startLocation;
	let timestamp = Date.now();

	for (let i = 0; i < duration; i++) {
		const telemetryData: DroneTelemetryData = {
			device,
			timestamp,
			latitude: currentLocation.latitude,
			longitude: currentLocation.longitude,
			altitude,
			velocityX,
			velocityY,
			velocityZ: 0,
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
			let res = await iotClient.send(
				new PublishCommand({
					payload: Buffer.from(JSON.stringify(telemetryData)),
					topic: topic
				})
			);
		}

		currentLocation = updateLocation(currentLocation, velocityX, velocityY, speed);
		const randomTime = Math.random() * 1000;
		timestamp += randomTime;
		await new Promise((resolve) => setTimeout(resolve, randomTime)); // wait for between 1 and 2 seconds
	}
}

function getDirection(startLocation: PathPoint, endLocation: PathPoint): number {
	const lat1 = (startLocation.latitude * Math.PI) / 180;
	const lon1 = (startLocation.longitude * Math.PI) / 180;
	const lat2 = (endLocation.latitude * Math.PI) / 180;
	const lon2 = (endLocation.longitude * Math.PI) / 180;

	const dlon = lon2 - lon1;

	return Math.atan2(
		Math.sin(dlon) * Math.cos(lat2),
		Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon)
	);
}

function updateLocation(
	currentLocation: PathPoint,
	velocityX: number,
	velocityY: number,
	speed: number
): PathPoint {
	const lat = currentLocation.latitude + (velocityY / speed) * 0.00001;
	const lon = currentLocation.longitude + (velocityX / speed) * 0.00001;

	return { latitude: lat, longitude: lon, altitude: currentLocation.altitude };
}
