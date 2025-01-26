import { Hono } from "hono";

export const locationRouter = new Hono();

locationRouter.post("/");
