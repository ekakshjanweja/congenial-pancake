import { Hono } from "hono";
import { seatTypeRouter } from "./seat";

export const seatRouter = new Hono();

seatRouter.route("/seat-type", seatTypeRouter);
