import { generateToken } from "authenticator";
import { authRouter } from "./auth";
import { db, user } from "@repo/db";
import { eq } from "drizzle-orm";
import { sendMessage } from "../../../utils/twilio";
import {
  errorResponse,
  ErrorType,
  successResponse,
} from "../../../utils/api-response";

authRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber as string;
  const totp = generateToken(phoneNumber + "AUTH");

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

authRouter.post("/signin/verify", async (c) => {});
