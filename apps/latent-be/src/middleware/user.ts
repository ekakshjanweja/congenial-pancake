import { Context } from "hono";
import { verify } from "hono/jwt";
import { JWT_SECRET } from "../config/config";

export const userMiddleware = async (c: Context) => {
  const token = c.req.header("Authorization");

  if (!token) {
    c.set("user", null);
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const user = await verify(token, JWT_SECRET!);

    c.set("user", user);
  } catch (error) {
    c.set("user", null);
    return c.json({ message: "Unauthorized" }, 401);
  }
};
