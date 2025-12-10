import { relations } from "drizzle-orm";
import { pgTable, jsonb, varchar, timestamp, serial, text, integer, index } from "drizzle-orm/pg-core";

// tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    eventType: varchar("event_type", { length: 500 }).notNull(),
    payload: jsonb(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("user_id_idx").on(table.userId), index("created_at_idx").on(table.createdAt)]
);

// relations
export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
}));
