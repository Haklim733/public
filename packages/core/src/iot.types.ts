import { z } from 'zod';

const iotTypes = z.enum(['AR', 'Other']);

export const iotFormSchema = z.object({
  number: z.number().min(1).max(5),
  type: iotTypes,
});
