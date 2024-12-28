import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const usersTable = pgTable('users', {
	id: serial('id').primaryKey().notNull(),
	username: varchar('username', { length: 20 }).notNull(),
	email: varchar('email', { length: 50 }).notNull().unique()
});

export const userSelectSchema = createSelectSchema(usersTable);
export const userInsertSchema = createInsertSchema(usersTable);

export type InsertUser = z.infer<typeof userInsertSchema>;
export type SelectUser = z.infer<typeof userSelectSchema>;

export const userInsertSchema2 = z.object({
	id: z.number().optional(),
	username: z.string().min(1).max(20),
	email: z.string().email().max(50)
});
