import { Hono } from "hono";
import { Roles } from "../../../enums/roles";
import { Status } from "../../../enums/status";
import { admin, db, EventInsert, LocationInsert } from "@repo/db";
import { eq } from "drizzle-orm";
import { errorResponse, ErrorType } from "../../../utils/api-response";

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

  const location = body.location;
  const event = body.event;

  const locationInsert: LocationInsert = {
    name: location.name,
    description: location.description,
    imageUrl: location.imageUrl,
  };

  const eventInsert: EventInsert = {
    eventName: event.eventName,
    description: event.description,
    bannerUrl: event.bannerUrl,
    adminId: userId,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    locationId: "",
  };

  return c.json({ message: "Event created", userId });
});
