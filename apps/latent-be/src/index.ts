import { Hono } from "hono";
import { config } from "dotenv";
import router from "./routes/router";

config({
  path: "../../../.env",
});

const app = new Hono();

app.route("", router);

export default {
  port: 8080,
  fetch: app.fetch,
};
