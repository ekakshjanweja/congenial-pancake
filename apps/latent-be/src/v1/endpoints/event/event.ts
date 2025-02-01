import { Hono } from "hono";
import { Roles } from "../../../enums/roles";
import {
  admin,
  db,
  EventInsert,
  location,
  event,
  booking,
  seatType,
} from "@repo/db";
import { eq } from "drizzle-orm";
import {
  errorResponse,
  ErrorType,
  successResponse,
} from "../../../utils/api-response";
import { CreateEventSchema } from "../../../../../../packages/common/src/types";

export const eventRouter = new Hono();

eventRouter.post("/", async (c) => {
  const payload = c.get("jwtPayload");

  const role = payload.role;

  if (role !== Roles.admin) {
    return c.json(errorResponse(ErrorType.NotAuthorizedToCreateAnEvent), 401);
  }

  const userId = payload.sub;

  const adminUser = (
    await db.select().from(admin).where(eq(admin.id, userId))
  )[0];

  if (!adminUser) {
    return c.json(errorResponse(ErrorType.AdminUserNotFound), 404);
  }

  const body = await c.req.json();

  const locationId = body.location;
  const eventData = body.event;

  if (!locationId) {
    return c.json(errorResponse(ErrorType.LocationIdRequired), 400);
  }

  const existingLocation = (
    await db.select().from(location).where(eq(location.id, locationId))
  )[0];

  if (!existingLocation) {
    return c.json(errorResponse(ErrorType.LocationDoesNotExist), 400);
  }

  const eventInsert: EventInsert = {
    eventName: eventData.eventName,
    description: eventData.description,
    bannerUrl: eventData.bannerUrl,
    adminId: userId,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    locationId: existingLocation.id,
  };

  const { data, success } = CreateEventSchema.safeParse(eventInsert);

  if (!success) {
    return c.json(errorResponse(ErrorType.InvalidBody), 400);
  }

  try {
    const existingEvent = await db
      .select()
      .from(event)
      .where(eq(event.eventName, eventInsert.eventName));

    if (existingEvent.length > 0) {
      return c.json(errorResponse(ErrorType.EventAlreadyExists), 400);
    }

    const [newEvent] = await db.insert(event).values(data).returning();

    return c.json(
      successResponse({
        event: newEvent,
      }),
      200
    );
  } catch (error) {
    return c.json(errorResponse(error as string), 400);
  }
});

eventRouter.get("/", async (c) => {
  try {
    const events = await db
      .select()
      .from(event)
      .fullJoin(booking, eq(event.id, booking.eventId))
      .fullJoin(location, eq(event.locationId, location.id))
      .fullJoin(seatType, eq(event.id, seatType.eventId));

    return c.json(successResponse({ events }), 200);
  } catch (error) {
    return c.json(errorResponse(ErrorType.UnknownError), 400);
  }
});

eventRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const existingEvent = (
      await db
        .select()
        .from(event)
        .where(eq(event.id, id))
        .fullJoin(booking, eq(event.id, booking.eventId))
        .fullJoin(location, eq(event.locationId, location.id))
        .fullJoin(seatType, eq(event.id, seatType.eventId))
    )[0];

    if (!existingEvent) {
      return c.json(errorResponse(ErrorType.ExistingEventNotFound), 404);
    }

    return c.json(successResponse({ event: existingEvent }), 200);
  } catch (error) {
    return c.json(errorResponse(ErrorType.UnknownError), 400);
  }
});

eventRouter.put("/:id", async (c) => {
  const payload = c.get("jwtPayload");

  const role = payload.role;

  if (role !== Roles.admin) {
    return c.json(errorResponse(ErrorType.NotAuthorizedToUpdateAnEvent), 401);
  }

  const userId = payload.sub;

  const adminUser = (
    await db.select().from(admin).where(eq(admin.id, userId))
  )[0];

  if (!adminUser) {
    return c.json(errorResponse(ErrorType.AdminUserNotFound), 404);
  }

  const id = c.req.param("id");

  const body = await c.req.json();

  const eventData = body.event;

  const existingEvent = (
    await db.select().from(event).where(eq(event.id, id))
  )[0];

  if (!existingEvent) {
    return c.json(errorResponse(ErrorType.ExistingEventNotFound), 404);
  }

  const eventUpdate: Partial<EventInsert> = {
    eventName: eventData.eventName,
    description: eventData.description,
    bannerUrl: eventData.bannerUrl,
    adminId: userId,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    locationId: existingEvent.locationId,
  };

  try {
    const [updatedEvent] = await db
      .update(event)
      .set(eventUpdate)
      .where(eq(event.id, id))
      .returning();

    return c.json(
      successResponse({
        event: updatedEvent,
      }),
      200
    );
  } catch (error) {
    return c.json(errorResponse(error as string), 400);
  }
});
