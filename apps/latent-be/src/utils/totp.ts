import { generateToken, verifyToken } from "authenticator";
import { TOTP_SECRET } from "../config/config";

export enum TotpType {
  auth = "AUTH",
}

export function getTotp(phoneNumber: string, type: TotpType) {
  return generateToken(phoneNumber + type + TOTP_SECRET!);
}

export function verifyTotp(phoneNumber: string, type: TotpType, otp: string) {
  return verifyToken(phoneNumber + type + TOTP_SECRET!, otp);
}
