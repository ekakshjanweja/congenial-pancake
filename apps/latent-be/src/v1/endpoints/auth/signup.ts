import { generateToken, verifyToken } from "authenticator";
import { db, user } from "@repo/db";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";
import { sendMessage } from "../../../utils/twilio";
import { authRouter } from "./auth";
import {
  errorResponse,
  ErrorType,
  successResponse,
} from "../../../utils/api-response";

authRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const topt = generateToken(phoneNumber + "AUTH");

  const exisitingUser = (
    await db.select().from(user).where(eq(user.phoneNumber, phoneNumber))
  )[0];

  if (exisitingUser) {
    return c.json(errorResponse(ErrorType.UserAlreadyExists), 400);
  }

  await db.insert(user).values({
    phoneNumber,
    username: "Anonymous",
  });

  const newUser = (
    await db.select().from(user).where(eq(user.phoneNumber, phoneNumber))
  )[0];

  if (process.env.NODE_ENV === "production") {
    await sendMessage(`Welcome to Latent - Your OTP is ${topt}`, phoneNumber);
  } else {
    console.log(`Welcome to Latent - Your OTP is ${topt}`);
  }

  //TODO: Remove totp from response

  return c.json(
    successResponse({
      user: newUser,
      topt,
    }),
    200
  );
});

authRouter.post("/signup/verify", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const username = body.username as string;
  const otp = body.totp as string;

  if (!otp) {
    return c.json(errorResponse(ErrorType.OTPRequired), 400);
  }

  if (!phoneNumber) {
    return c.json(errorResponse(ErrorType.PhoneNumberRequired), 400);
  }

  if (!username) {
    return c.json(errorResponse(ErrorType.UserNameRequired), 400);
  }

  const isValid = verifyToken(phoneNumber + "AUTH", otp);

  if (!isValid) {
    return c.json(errorResponse(ErrorType.InvalidOTP), 400);
  }

  await db
    .update(user)
    .set({ username, verified: true })
    .where(eq(user.phoneNumber, phoneNumber));

  const updatedUser = (
    await db.select().from(user).where(eq(user.phoneNumber, phoneNumber))
  )[0];

  if (!updatedUser) {
    return c.json(errorResponse(ErrorType.UserNotFound), 400);
  }

  //TODO: Create acccess token and refresh token

  const payload = {
    sub: updatedUser.id,
    role: "user",
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const token = await sign(payload, "secret");

  return c.json(successResponse({ updatedUser, token }), 200);
});
