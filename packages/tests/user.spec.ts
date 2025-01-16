import axios from "axios";
import { describe, expect, it, test } from "vitest";

const BACKEND_URL = "http://localhost:8080";
const BASE_URL = "api/v1";
const BACKEND_ENDPOINT = `${BACKEND_URL}/${BASE_URL}`;

const PHONE_1 = "8178656358";
const NAME_1 = "Ekaksh";

describe("Signup endpoints", () => {
  it("Signup + Doule Signup Doesnt Work", async () => {
    const otpOne = await axios.post(`${BACKEND_ENDPOINT}/signup`, {
      phone: PHONE_1,
      name: NAME_1,
    });

    const otpVerificationOne = await axios.post(
      `${BACKEND_ENDPOINT}/signup/verify`,
      {
        opt: "000000",
      }
    );

    expect(otpOne.status).toBe(200);
    expect(otpVerificationOne.status).toBe(200);
    expect(otpOne.data.id).not.toBeNull();

    expect(async () => {
      await axios.post(`${BACKEND_ENDPOINT}/signup`, {
        phone: PHONE_1,
        name: NAME_1,
      });
    }).toThrowError();
  });
});

test("should first", () => {
  expect(3).toBe(3);
});
