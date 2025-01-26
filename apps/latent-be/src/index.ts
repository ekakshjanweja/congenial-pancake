import { Hono } from "hono";
import * as dotenv from "dotenv";
import router from "./routes/router";
import { JWT_SECRET, loadEnv } from "./config/config";
import { jwt } from "hono/jwt";
import { Status } from "./enums/status";

dotenv.config();

loadEnv();

const app = new Hono();

app.use("/api/v1/*", async (c, next) => {
  if (c.req.path.startsWith("/api/v1/auth/")) {
    return next();
  }

  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return c.json(
        {
          data: {
            message: "Unauthorized! No Authorization header found.",
          },
          status: Status.error,
        },
        401
      );
    }

    const jwtMiddleware = jwt({
      secret: JWT_SECRET!,
    });
    return await jwtMiddleware(c, next);
  } catch (error) {
    return c.json(
      {
        data: {
          message: "Unauthorized",
          error: error,
        },
        status: Status.error,
      },
      401
    );
  }
});

app.route("/api/v1", router);

export default {
  port: 8080,
  fetch: app.fetch,
};
