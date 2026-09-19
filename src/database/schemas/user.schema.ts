import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

import { organizations } from './organization.schema';

export const userRoleEnum = pgEnum('user_role', [
  'SUPER_ADMIN',
  'ADMIN',
  'USER',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  organizationId: uuid('organization_id').references(() => organizations.id, {
    onDelete: 'cascade',
  }),

  name: varchar('name', { length: 255 }).notNull(),

  email: varchar('email', { length: 255 }).notNull().unique(),

  passwordHash: varchar('password_hash', {
    length: 255,
  }).notNull(),

  role: userRoleEnum('role').default('USER').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
