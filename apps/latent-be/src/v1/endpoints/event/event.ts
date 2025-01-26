import { Hono } from "hono";

export const eventRouter = new Hono();

eventRouter.post("/", async (c) => {
  //TODO: Check if user is admin or not

  const payload = c.get("jwtPayload");

  return c.json({ message: "Event created", payload });
});
