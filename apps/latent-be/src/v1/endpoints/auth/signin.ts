import { authRouter } from "./auth";
import { db, user } from "@repo/db";
import { eq } from "drizzle-orm";
import { sendMessage } from "../../../utils/twilio";
import {
  errorResponse,
  ErrorType,
  successResponse,
} from "../../../utils/api-response";
import { sign } from "hono/jwt";
import { JWT_SECRET, TOTP_SECRET } from "../../../config/config";
import { getTotp, TotpType, verifyTotp } from "../../../utils/totp";

authRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const totp = getTotp(phoneNumber, TotpType.auth);

  const exisitingUser = (
    await db.select().from(user).where(eq(user.phoneNumber, phoneNumber))
  )[0];

  if (!exisitingUser) {
    return c.json(errorResponse(ErrorType.UserNotFound), 400);
  }

  if (process.env.NODE_ENV === "production") {
    await sendMessage(
      `Welcome back to Latent - Your OTP is ${totp}`,
      phoneNumber
    );
  } else {
    console.log(`Welcome back to Latent - Your OTP is ${totp}`);
  }

  //TODO: Remove totp from response

  return c.json(
    successResponse({ message: "OTP sent successfully", totp }),
    200
  );
});

authRouter.post("/signin/verify", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const otp = body.otp as string;

  if (!otp) {
    return c.json(errorResponse(ErrorType.OTPRequired), 400);
  }

  if (!phoneNumber) {
    return c.json(errorResponse(ErrorType.PhoneNumberRequired), 400);
  }

  const isValid = verifyTotp(phoneNumber, TotpType.auth, otp);

  if (!isValid) {
    return c.json(errorResponse(ErrorType.InvalidOTP), 400);
  }

  const exisitingUser = (
    await db.select().from(user).where(eq(user.phoneNumber, phoneNumber))
  )[0];

  if (!exisitingUser) {
    return c.json(errorResponse(ErrorType.UserNotFound), 400);
  }

  const payload = {
    sub: exisitingUser.id,
    role: "user",
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
