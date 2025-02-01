import { Hono } from "hono";
import { Roles } from "../../../enums/roles";
import { errorResponse, ErrorType } from "../../../utils/api-response";
import { admin, db, SeatTypeInsert } from "@repo/db";
import { eq } from "drizzle-orm";

export const seatTypeRouter = new Hono();

seatTypeRouter.post("/", async (c) => {
  const payload = c.get("jwtPayload");

  const role = payload.role;

  if (role !== Roles.admin) {
    return c.json(errorResponse(ErrorType.NotAuthorizedToCreateASeat), 401);
  }

  const userId = payload.sub;

  const adminUser = (
    await db.select().from(admin).where(eq(admin.id, userId))
  )[0];

  if (!adminUser) {
    return c.json(errorResponse(ErrorType.AdminUserNotFound), 404);
  }

  const body = await c.req.json();

  const seat = body.seat;

  const seatTypeInsert: SeatTypeInsert = {
    seatTypeName: seat.seatTypeName,
    description: seat.description,
    price: seat.price,
    eventId: seat.eventId,
    eventName: seat.eventName,
    capacity: seat.capacity,
  };
});
