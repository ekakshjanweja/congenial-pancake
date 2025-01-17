import { Hono } from "hono";
import { generateToken } from "authenticator";

export const user = new Hono();

user.post("/signup", async (c) => {
  const body = await c.req.parseBody();
  const phoneNumber = body.phoneNumber as string;
  const topt = generateToken(phoneNumber + "signup");
  return c.json({ topt }, 200);
});

user.post("/signup/verify", async (req, res) => {});
