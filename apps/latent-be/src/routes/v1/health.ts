import { Hono } from "hono";

export const HEALTH_ROUTE_NAME = "/health";

export const healthRouter = new Hono();

healthRouter.get("/", async (c) => {
  return c.json({ status: "ok" }, 200);
});
