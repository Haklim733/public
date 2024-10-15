import { z } from 'zod';

const iotTypes = z.enum(['drone']);
const waypointSchema = z.object({
	latitude: z.number(),
	longitude: z.number()
});

const waypointsSchema = z
	.array(waypointSchema)
	.min(1, 'Waypoints cannot be empty')
	.max(10, 'Too many waypoints');

export const iotFormSchema = z.object({
	waypoints: waypointsSchema,
	speed: z.number().min(5).max(100),
	sessionId: z.string(),
	service: iotTypes
});
export type IotFormSchema = typeof iotFormSchema;

export const startLocSchema = z.object({
	latitude: z.number(),
	longitude: z.number()
});
export type StartLocFormSchema = typeof startLocSchema;
