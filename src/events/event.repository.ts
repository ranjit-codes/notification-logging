import { InferInsertModel } from "drizzle-orm";
import { db } from "../config/db.js";
import { events } from "../models/schema.js";

export type NewEvent = InferInsertModel<typeof events>;

export const eventRepository = {
  async create(eventData: NewEvent) {
    const [createdEvent] = await db.insert(events).values(eventData).returning();

    return createdEvent;
  },

  async findByUserId(userId: number, limit: number = 10) {
    return await db.query.events.findMany({
      where: (events, { eq }) => eq(events.userId, userId),
      limit: limit,
      orderBy: (events, { desc }) => [desc(events.createdAt)],
    });
  },
};
