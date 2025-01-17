import { Hono } from "hono";
import { generateToken } from "authenticator";

export const USER_ROUTE_NAME = "/user";

export const userRouter = new Hono();

userRouter.post("/signup", async (c) => {
  const body = await c.req.parseBody();
  const phoneNumber = body.phoneNumber as string;
  const topt = generateToken(phoneNumber + "signup");
  return c.json({ topt }, 200);
});

userRouter.post("/signup/verify", async (req, res) => {});
