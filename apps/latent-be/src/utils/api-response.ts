import { Status } from "../enums/status";

export interface ApiResponse<T = "unknown"> {
  data: T;
  status: Status;
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    status: Status.success,
  };
}

export function errorResponse<T>(
  errorType: ErrorType
): ApiResponse<{ message: ErrorType }> {
  return {
    data: {
      message: errorType,
    },
    status: Status.error,
  };
}

export enum ErrorType {
  InvalidOTP = "Invalid OTP code provided",
  PhoneNumberRequired = "Phone number is required",
  UserNameRequired = "Username is required",
  OTPRequired = "OTP code is required",
  UserAlreadyExists = "User already exists! Please sign in.",
  UserNotFound = "User not found! Please sign up first.",
  UserDoesNotExist = "User does not exist! Please sign up first.",
  UnauthorizedNoAuthheaderFound = "Unauthorized! No Authorization header found.",
  Unauthorized = "Unauthorized",
  NotAuthorizedToCreateAnEvent = "You are not authorized to create an event. Only admins can create events!",
  AdminUserNotFound = "Admin user not found",
}
