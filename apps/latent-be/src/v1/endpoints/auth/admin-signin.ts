import { Hono } from "hono";
import { getTotp, TotpType, verifyTotp } from "../../../utils/totp";
import { eq } from "drizzle-orm";
import { admin, db } from "@repo/db";
import {
  errorResponse,
  ErrorType,
  successResponse,
} from "../../../utils/api-response";
import { JWT_SECRET, NODE_ENV } from "../../../config/config";
import { sendMessage } from "../../../utils/twilio";
import { sign } from "hono/jwt";

export const adminSignInAuthRouter = new Hono();

adminSignInAuthRouter.post("/", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const otp = getTotp(phoneNumber, TotpType.adminAuth);

  const exisitingUser = (
    await db.select().from(admin).where(eq(admin.phoneNumber, phoneNumber))
  )[0];

  if (!exisitingUser) {
    return c.json(errorResponse(ErrorType.UserNotFound), 400);
  }

  if (NODE_ENV === "production") {
    await sendMessage(
      `Welcome back to Latent - Your OTP is ${otp}`,
      phoneNumber
    );

    return c.json(successResponse({ message: "OTP sent successfully" }), 200);
  } else {
    console.log(`Welcome back to Latent - Your OTP is ${otp}`);

    return c.json(
      successResponse({ message: "OTP sent successfully", otp }),
      200
    );
  }
});

adminSignInAuthRouter.post("/verify", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const otp = body.otp as string;

  if (!otp) {
    return c.json(errorResponse(ErrorType.OTPRequired), 400);
  }

  if (!phoneNumber) {
    return c.json(errorResponse(ErrorType.PhoneNumberRequired), 400);
  }

  const isValid = verifyTotp(phoneNumber, TotpType.adminAuth, otp);

  if (!isValid) {
    return c.json(errorResponse(ErrorType.InvalidOTP), 400);
  }

  const exisitingUser = (
    await db.select().from(admin).where(eq(admin.phoneNumber, phoneNumber))
  )[0];

  if (!exisitingUser) {
    return c.json(errorResponse(ErrorType.UserNotFound), 400);
  }

  const payload = {
    sub: exisitingUser.id,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const token = await sign(payload, JWT_SECRET!);

  return c.json(
    successResponse({
      message: "User verified successfully",
      token,
    }),
    200
  );
});
