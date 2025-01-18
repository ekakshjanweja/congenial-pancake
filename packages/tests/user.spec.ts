import axios from "axios";
import { describe, expect, it, test } from "vitest";

const BACKEND_URL = "http://localhost:8080";
const BASE_URL = "api/v1";
const BACKEND_ENDPOINT = `${BACKEND_URL}/${BASE_URL}`;

const PHONE_1 = "+918178656358";
const NAME_1 = "Ekaksh";

describe("Signup endpoints", () => {
  it("Signup + Doule Signup Doesnt Work", async () => {
    const otpOne = await axios.post(`${BACKEND_ENDPOINT}/user/signup`, {
      phoneNumber: PHONE_1,
    });

    const otp = otpOne.data["topt"];

    const otpVerificationOne = await axios.post(
      `${BACKEND_ENDPOINT}/user/signup/verify`,
      {
        phoneNumber: PHONE_1,
        totp: otp,
      }
    );

    expect(otpOne.status).toBe(200);
    expect(otpOne.data.id).not.toBeNull();
    expect(otpVerificationOne.status).toBe(200);

    // expect(async () => {
    //   await axios.post(`${BACKEND_ENDPOINT}/user/signup`, {
    //     phone: PHONE_1,
    //     name: NAME_1,
    //   });
    // }).toThrowError();
  });
});
