import { db, NewToken, tokens, UserSelect } from "@repo/db";
import { sign } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

enum ExpiryUnit {
  SECONDS = "seconds",
  MINUTES = "minutes",
  HOURS = "hours",
  DAYS = "days",
}

const createTokenExpiry = (value: number, expiryUnit: ExpiryUnit): number => {
  if (value <= 0) {
    value = 1;
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  switch (expiryUnit) {
    case ExpiryUnit.SECONDS:
      return currentTimeInSeconds + value;
    case ExpiryUnit.MINUTES:
      return currentTimeInSeconds + value * 60;
    case ExpiryUnit.HOURS:
      return currentTimeInSeconds + value * 60 * 60;
    case ExpiryUnit.DAYS:
      return currentTimeInSeconds + value * 24 * 60 * 60;
    default:
      throw new Error("Invalid expiry unit");
  }
};

export async function createToken(user: UserSelect) {
  //TODO: Clean up expired tokens for this user

  const accessTokenExpiresAt = createTokenExpiry(1, ExpiryUnit.HOURS);
  const refreshTokenExpiresAt = createTokenExpiry(30, ExpiryUnit.DAYS);

  const accessTokenPayload: JWTPayload = {
    sub: user.phoneNumber,
    role: "user",
    exp: accessTokenExpiresAt,
  };

  const refreshTokenPayload: JWTPayload = {
    sub: user.id,
    role: "user",
    exp: refreshTokenExpiresAt,
  };

  const accessToken = await sign(accessTokenPayload, "secret");
  const refreshToken = await sign(refreshTokenPayload, "secret");

  const newToken: NewToken = {
    userId: user.id || "",
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenExpiresAt: new Date(accessTokenExpiresAt * 1000),
    refreshTokenExpiresAt: new Date(refreshTokenExpiresAt * 1000),
  };

  await db.insert(tokens).values(newToken);

  //TODO: Set cookies in endpoint
}

export async function refreshAccessToken(refreshToken: string) {}

export async function verifyAccessToken(accessToken: string) {}

export async function revokeAccessToken(accessToken: string) {}

export async function cleanUpExpiredTokens() {}
