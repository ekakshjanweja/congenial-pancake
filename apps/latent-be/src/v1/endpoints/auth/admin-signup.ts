import { Hono } from "hono";
import { db, admin } from "@repo/db";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";
import { sendMessage } from "../../../utils/twilio";
import {
  errorResponse,
  ErrorType,
  successResponse,
} from "../../../utils/api-response";
import { JWT_SECRET, NODE_ENV } from "../../../config/config";
import { getTotp, TotpType, verifyTotp } from "../../../utils/totp";

export const adminSignUpAuthRouter = new Hono();

adminSignUpAuthRouter.post("/", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const otp = getTotp(phoneNumber, TotpType.auth);

  const exisitingUser = (
    await db.select().from(admin).where(eq(admin.phoneNumber, phoneNumber))
  )[0];

  if (exisitingUser) {
    return c.json(errorResponse(ErrorType.UserAlreadyExists), 400);
  }

  await db.insert(admin).values({
    phoneNumber,
    username: "Anonymous",
  });

  const newUser = (
    await db.select().from(admin).where(eq(admin.phoneNumber, phoneNumber))
  )[0];

  if (NODE_ENV === "production") {
    await sendMessage(`Welcome to Latent - Your OTP is ${otp}`, phoneNumber);

    return c.json(
      successResponse({
        user: newUser,
      }),
      200
    );
  } else {
    console.log(`Welcome to Latent - Your OTP is ${otp}`);

    return c.json(
      successResponse({
        user: newUser,
        otp,
      }),
      200
    );
  }
});

adminSignUpAuthRouter.post("/verify", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const username = body.username as string;
  const otp = body.otp as string;

  if (!otp) {
    return c.json(errorResponse(ErrorType.OTPRequired), 400);
  }

  if (!phoneNumber) {
    return c.json(errorResponse(ErrorType.PhoneNumberRequired), 400);
  }

  if (!username) {
    return c.json(errorResponse(ErrorType.UserNameRequired), 400);
  }

  const isValid = verifyTotp(phoneNumber, TotpType.auth, otp);

  if (!isValid) {
    return c.json(errorResponse(ErrorType.InvalidOTP), 400);
  }

  await db
    .update(admin)
    .set({ username, verified: true })
    .where(eq(admin.phoneNumber, phoneNumber));

  const updatedUser = (
    await db.select().from(admin).where(eq(admin.phoneNumber, phoneNumber))
  )[0];

  if (!updatedUser) {
    return c.json(errorResponse(ErrorType.UserNotFound), 400);
  }

  //TODO: Create acccess token and refresh token

  const payload = {
    sub: updatedUser.id,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const token = await sign(payload, JWT_SECRET!);

  return c.json(successResponse({ updatedUser, token }), 200);
});
