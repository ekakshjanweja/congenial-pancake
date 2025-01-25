export const TOTP_SECRET = process.env.TOTP_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET;

export function loadEnv() {
  if (!TOTP_SECRET) {
    throw new Error("TOTP_SECRET is required");
  }

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }
}
