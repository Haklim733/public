interface DroneTelemetryData {
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
	altitude: number;
}

export function generateDroneTelemetryData(
	device: string,
	startLocation: PathPoint,
	endLocation: PathPoint,
	numPoints: number,
	speed: number,
	altitude: number
): DroneTelemetryData[] {
	if (numPoints <= 0) {
		throw new Error('numPoints must be a positive integer');
	}
	const pathPoints: PathPoint[] = [];
	for (let i = 0; i < numPoints; i++) {
		const lat =
			startLocation.latitude +
			(endLocation.latitude - startLocation.latitude) * (i / (numPoints - 1));
		const lon =
			startLocation.longitude +
			(endLocation.longitude - startLocation.longitude) * (i / (numPoints - 1));
		pathPoints.push({ latitude: lat, longitude: lon, altitude });
	}

	const telemetryData: DroneTelemetryData[] = [];
	for (let i = 0; i < pathPoints.length; i++) {
		const point = pathPoints[i];
		const timestamp = Date.now(); // assume 1 second between each point
		const velocityX = speed * Math.cos(Math.PI / 4); // assume constant speed and direction
		const velocityY = speed * Math.sin(Math.PI / 4);
		const velocityZ = 0;
		const accelerationX = 0;
		const accelerationY = 0;
		const accelerationZ = 0;
		const roll = 0;
		const pitch = 0;
		const yaw = 0;
		const batteryVoltage = 12;
		const batteryCurrent = 1;

		telemetryData.push({
			device,
			timestamp,
			latitude: point.latitude,
			longitude: point.longitude,
			altitude: point.altitude,
			velocityX,
			velocityY,
			velocityZ,
			accelerationX,
			accelerationY,
			accelerationZ,
			roll,
			pitch,
			yaw,
			batteryVoltage,
			batteryCurrent
		});
	}

	return telemetryData;
}
