import { Hono } from "hono";
import { Roles } from "../../../enums/roles";
import {
  errorResponse,
  ErrorType,
  successResponse,
} from "../../../utils/api-response";
import { admin, db, seatType, SeatTypeInsert } from "@repo/db";
import { eq } from "drizzle-orm";
import { CreateSeatTypeSchema } from "../../../../../../packages/common/src/types";

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

  const { seatTypeName, description, price, eventId, capacity } = body;

  const seatTypeInsert: SeatTypeInsert = {
    seatTypeName: seatTypeName,
    description: description,
    price: price,
    eventId: eventId,
    capacity: capacity,
  };

  const { data, success } = CreateSeatTypeSchema.safeParse(seatTypeInsert);

  if (!success) {
    return c.json(errorResponse(ErrorType.InvalidBody), 400);
  }

  try {
    const existingSeatType = (
      await db
        .select()
        .from(seatType)
        .where(eq(seatType.seatTypeName, seatTypeName))
    )[0];

    if (existingSeatType) {
      return c.json(errorResponse(ErrorType.SeatTypeAlreadyExists), 400);
    }

    const [newSeatType] = await db.insert(seatType).values(data).returning();

    return c.json(
      successResponse({
        seat: newSeatType,
      }),
      200
    );
  } catch (error) {
    return c.json(errorResponse(error as string), 500);
  }
});

seatTypeRouter.get("/", async (c) => {
  const eventId = c.req.query("eventId");

  if (!eventId) {
    return c.json(errorResponse(ErrorType.InvalidQuery), 400);
  }

  try {
    const seatTypes = await db
      .select()
      .from(seatType)
      .where(eq(seatType.eventId, eventId));

    return c.json(successResponse({ seatTypes }), 200);
  } catch (error) {
    return c.json(errorResponse(ErrorType.UnknownError), 500);
  }
});
