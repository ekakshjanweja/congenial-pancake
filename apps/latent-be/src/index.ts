import { Hono } from "hono";
import router from "./routes/router";

const app = new Hono();

app.route("", router);

export default {
  port: 8080,
  fetch: app.fetch,
};
