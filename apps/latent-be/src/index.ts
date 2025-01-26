import { Hono } from "hono";
import * as dotenv from "dotenv";
import router from "./routes/router";
import { loadEnv } from "./config/config";
import { adminMiddleware } from "./middleware/admin";
import { userMiddleware } from "./middleware/user";

dotenv.config();

loadEnv();

const app = new Hono();

app.use(userMiddleware);
app.use(adminMiddleware);

app.route("/api/v1", router);

export default {
  port: 8080,
  fetch: app.fetch,
};
