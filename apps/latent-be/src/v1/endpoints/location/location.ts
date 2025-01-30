import { Hono } from "hono";
import { Roles } from "../../../enums/roles";
import {
  errorResponse,
  ErrorType,
  successResponse,
} from "../../../utils/api-response";
import { admin, db, location, LocationInsert } from "@repo/db";
import { eq } from "drizzle-orm";
import { CreateLocationSchema } from "@repo/common";

export const locationRouter = new Hono();

locationRouter.post("/", async (c) => {
  const payload = c.get("jwtPayload");

  const role = payload.role;

  if (role !== Roles.admin) {
    return c.json(errorResponse(ErrorType.NotAuthorizedToCreateALocation), 401);
  }

  const userId = payload.sub;

  const adminUser = (
    await db.select().from(admin).where(eq(admin.id, userId))
  )[0];

  if (!adminUser) {
    return c.json(errorResponse(ErrorType.AdminUserNotFound), 404);
  }

  const body = await c.req.json();

  const { name, description, imageUrl } = body;

  const locationInsert: LocationInsert = {
    name: name,
    description: description,
    imageUrl: imageUrl,
  };

  const { data, success } = CreateLocationSchema.safeParse(locationInsert);

  if (!success) {
    return c.json(errorResponse(ErrorType.InvalidBody), 400);
  }

  try {
    const [newLocation] = await db.insert(location).values(data).returning();

    return c.json(
      successResponse({
        location: newLocation,
      }),
      200
    );
  } catch (error) {
    return c.json(errorResponse(ErrorType.UnknownError), 400);
  }
});
