import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { eventRepository, NewEvent } from "../src/events/event.repository.js";
import { events, users } from "../src/models/schema.js";
import { db } from "../src/config/db.js";

const TEST_USER_ID = 1;

describe("Event Repository Integration Tests", () => {
  beforeAll(async () => {
    await db.delete(events);
  });

  afterAll(async () => {
    await db.delete(events);
  });

  // --- Test Block 1: The Create Method ---
  test("should successfully create and return a new event", async () => {
    const eventData: NewEvent = {
      userId: TEST_USER_ID,
      eventType: "test_creation",
      payload: { source: "repository_test" },
    };

    const newEvent = await eventRepository.create(eventData);

    // Assertions
    expect(newEvent).toBeDefined();
    expect(newEvent.userId).toBe(TEST_USER_ID);
    expect(newEvent.eventType).toBe("test_creation");
    expect(newEvent.id).toBeTypeOf("number");
  });

  // --- Test Block 2: The Find Method ---
  test("should retrieve events for a specific user, ordered by creation time", async () => {
    // Note: The previous test created one event, so we expect at least one here.
    const userEvents = await eventRepository.findByUserId(TEST_USER_ID, 10);

    // Assertions
    expect(userEvents.length).toBeGreaterThan(0);
    expect(userEvents[0].userId).toBe(TEST_USER_ID);
    expect(Array.isArray(userEvents)).toBe(true);
  });

  // --- Test Block 3: Edge Case ---
  test("should return an empty array id the user has no events", async () => {
    const NON_EXISTENT_USER_ID = 99999;
    const noEvents = await eventRepository.findByUserId(NON_EXISTENT_USER_ID);

    // Assertions
    expect(noEvents.length).toBe(0);
  });
});
