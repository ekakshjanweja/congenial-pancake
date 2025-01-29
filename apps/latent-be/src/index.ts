import { Hono } from "hono";
import * as dotenv from "dotenv";
import router from "./routes/router";
import { JWT_SECRET, loadEnv } from "./config/config";
import { jwt } from "hono/jwt";
import { Status } from "./enums/status";
import { authMiddleware } from "./v1/middlewares/auth";

dotenv.config();

loadEnv();

const app = new Hono();

app.use("/api/v1/*", authMiddleware);

app.route("/api/v1", router);

export default {
  port: 8080,
  fetch: app.fetch,
};
