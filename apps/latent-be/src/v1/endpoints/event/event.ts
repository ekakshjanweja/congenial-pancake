import { Hono } from "hono";
import { Roles } from "../../../enums/roles";
import { Status } from "../../../enums/status";

export const eventRouter = new Hono();

eventRouter.post("/", async (c) => {
  const payload = c.get("jwtPayload");

  const role = payload.role;

  if (role !== Roles.admin) {
    return c.json(
      {
        data: {
          message:
            "You are not authorized to create an event. Only admins can create events!",
        },
        status: Status.error,
      },
      401
    );
  }

  const userId = payload.sub;

  return c.json({ message: "Event created", userId });
});
