import { Hono } from "hono";
import { generateToken, verifyToken } from "authenticator";

export const user = new Hono();

user.post("/signup", async (c) => {
  const body = await c.req.parseBody();
  const phoneNumber = body.phoneNumber as string;
  const topt = generateToken(phoneNumber + "AUTH");

  //TODO: Send OTP to phoneNumber

  return c.json({ topt }, 200);
});

user.post("/signup/verify", async (c) => {
  const body = await c.req.parseBody();
  const phoneNumber = body.phoneNumber as string;
  const otp = body.topt as string;

  const isValid = verifyToken(phoneNumber + "AUTH", otp);

  if (!isValid) {
    return c.json({ message: "Invalid OTP" }, 400);
  }

  //TODO: Set verified user in db
  //TODO: Also return the newly created user object

  return c.json({ message: "User verified" }, 200);
});
