import { Hono } from "hono";
import * as dotenv from "dotenv";
import router from "./routes/router";

dotenv.config();

const app = new Hono();

app.route("", router);

export default {
  port: 8080,
  fetch: app.fetch,
};
