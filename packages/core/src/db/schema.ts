import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';

export const usersTable = pgTable('users', {
	id: serial('id').primaryKey().notNull(),
	username: varchar('username', { length: 256 }).notNull(),
	email: varchar('email', { length: 256 }).notNull().unique()
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export const userSelectSchema = createSelectSchema(usersTable);
export const userInsertSchema = createInsertSchema(usersTable);
