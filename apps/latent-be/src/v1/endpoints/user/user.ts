import { Hono } from "hono";
import { generateToken, verifyToken } from "authenticator";
import { db, user, UserInsert } from "@repo/db";
import { eq } from "drizzle-orm";
import { Status } from "../../../enums/status";
import { sign } from "hono/jwt";

export const userRouter = new Hono();

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const topt = generateToken(phoneNumber + "AUTH");

  const exisitingUser = (
    await db.select().from(user).where(eq(user.phoneNumber, phoneNumber))
  )[0];

  if (exisitingUser) {
    return c.json({ message: "User already exists" }, 400);
  }

  if (process.env.NODE_ENV === "production") {
    //TODO: Send OTP to phoneNumber
  }

  await db.insert(user).values({
    phoneNumber,
    username: "Anonymous",
  });

  const newUser = (
    await db.select().from(user).where(eq(user.phoneNumber, phoneNumber))
  )[0];

  return c.json({ user: newUser, topt }, 200);
});

userRouter.post("/signup/verify", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const username = body.username as string;
  const otp = body.totp as string;

  if (!otp) {
    return c.json(
      {
        data: {
          message: "OTP is required",
        },
        status: Status.error,
      },
      400
    );
  }

  if (!phoneNumber) {
    return c.json(
      {
        data: {
          message: "Phone Number is required",
        },
        status: Status.error,
      },
      400
    );
  }

  if (!username) {
    return c.json(
      {
        data: {
          message: "User Name is required",
        },
        status: Status.error,
      },
      400
    );
  }

  const isValid = verifyToken(phoneNumber + "AUTH", otp);

  if (!isValid) {
    return c.json(
      {
        data: {
          message: "Invalid OTP provided",
        },
        status: Status.error,
      },
      400
    );
  }

  await db
    .update(user)
    .set({ username, verified: true })
    .where(eq(user.phoneNumber, phoneNumber));

  const updatedUser = (
    await db.select().from(user).where(eq(user.phoneNumber, phoneNumber))
  )[0];

  //TODO: Create acccess token and refresh token

  const payload = {
    sub: updatedUser.id,
    role: "user",
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const token = await sign(payload, "secret");

  return c.json(
    {
      data: { updatedUser, token },
      status: Status.success,
    },
    200
  );
});
