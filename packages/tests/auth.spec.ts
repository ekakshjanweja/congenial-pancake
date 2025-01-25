import axios from "axios";
import { describe, expect, it } from "vitest";
import { db, user } from "@repo/db";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

const BACKEND_URL = "http://localhost:8080";
const BASE_URL = "api/v1";
const BACKEND_ENDPOINT = `${BACKEND_URL}/${BASE_URL}/auth`;

const PHONE_1 = "+918178656358";
const NAME_1 = "stormej";

dotenv.config();

describe("Signup endpoints", () => {
  it("Signup + Doule Signup Doesnt Work", async () => {
    const otpOne = await axios.post(`${BACKEND_ENDPOINT}/signup`, {
      phoneNumber: PHONE_1,
    });

    const otp = otpOne.data["opt"];

    expect(otpOne.status).toBe(200);
    expect(otp).not.toBeNull();

    const otpVerificationOne = await axios.post(
      `${BACKEND_ENDPOINT}/signup/verify`,
      {
        username: NAME_1,
        phoneNumber: PHONE_1,
        otp,
      }
    );

    expect(otpVerificationOne.status).toBe(200);

    const otpTwo = await axios.post(`${BACKEND_ENDPOINT}/signup`, {
      phoneNumber: PHONE_1,
    });

    expect(otpTwo.status).toBe(400);
  });
});

// describe("Signin endpoints", () => {
//   it("SignIn", async () => {
//     const otpOne = await axios.post(`${BACKEND_ENDPOINT}/auth/signin`, {
//       phoneNumber: PHONE_1,
//     });

//     const otp = otpOne.data["topt"];

//     const otpVerificationOne = await axios.post(
//       `${BACKEND_ENDPOINT}/user/auth/signin`,
//       {
//         phoneNumber: PHONE_1,
//         totp: otp,
//       }
//     );

//     expect(otpOne.status).toBe(200);
//     expect(otpOne.data.id).not.toBeNull();
//     expect(otpVerificationOne.status).toBe(200);

//     await db.delete(user).where(eq(user.phoneNumber, PHONE_1));
//   });
// });
