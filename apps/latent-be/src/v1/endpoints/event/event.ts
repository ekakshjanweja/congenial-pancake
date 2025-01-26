import { Hono } from "hono";
import { Roles } from "../../../enums/roles";

export const eventRouter = new Hono();

eventRouter.post("/", async (c) => {
  //TODO: Check if user is admin or not

  const payload = c.get("jwtPayload");

  const role = payload.role;

  if (role !== Roles.admin) {
    return c.json({ message: "Unaubnbjsthorized" }, 401);
  }

  const userId = payload.sub;

  return c.json({ message: "Event created", userId });
});
