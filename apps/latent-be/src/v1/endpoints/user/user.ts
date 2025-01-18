import { Hono } from "hono";
import { generateToken, verifyToken } from "authenticator";
import { db, user } from "@repo/db";
import { eq } from "drizzle-orm";

export const userRouter = new Hono();

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const topt = generateToken(phoneNumber + "AUTH");

  const users = await db
    .select()
    .from(user)
    .where(eq(user.phoneNumber, phoneNumber));

  // if (!exisitingUser) {
  //   return c.json({ message: "User already exists" }, 400);
  // }

  //TODO: Send OTP to phoneNumber

  return c.json({ topt }, 200);
});

userRouter.post("/signup/verify", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const otp = body.totp as string;

  console.log(phoneNumber, otp);

  if (!otp) {
    return c.json({ message: "OTP is required" }, 400);
  }

  const isValid = verifyToken(phoneNumber + "AUTH", otp);

  if (!isValid) {
    return c.json({ message: "Invalid OTP" }, 400);
  }

  //TODO: Set verified user in db
  //TODO: Also return the newly created user object

  return c.json({ message: "User verified" }, 200);
});
