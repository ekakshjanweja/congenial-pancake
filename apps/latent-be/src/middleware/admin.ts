import { Context } from "hono";
import { ADMIN_JWT_SECRET } from "../config/config";
import { verify } from "hono/jwt";

export const adminMiddleware = async (c: Context) => {
  const token = c.req.header("Authorization");
  if (!token) {
    c.set("user", null);
    return c.json({ message: "Unauthorized" }, 401);
  }
  try {
    const user = await verify(token, ADMIN_JWT_SECRET!);
    c.set("user", user);
  } catch (error) {
    c.set("user", null);
    return c.json({ message: "Unauthorized" }, 401);
  }
};
