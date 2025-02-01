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
  errorType: ErrorType | string
): ApiResponse<{ message: ErrorType | string }> {
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
  NotAuthorizedToCreateALocation = "You are not authorized to create a location. Only admins can create locations!",
  InvalidBody = "Invalid body provided",
  UnknownError = "Unknown error occurred",
  LocationAlreadyExists = "Location already exists",
  LocationIdRequired = "Location ID is required",
  LocationDoesNotExist = "Location does not exist",
  EventAlreadyExists = "Event already exists",
  ExistingEventNotFound = "Existing event not found",
  NotAuthorizedToUpdateAnEvent = "You are not authorized to update an event. Only admins can update events!",
  NotAuthorizedToCreateASeat = "You are not authorized to create a seat. Only admins can create seats!",
  SeatTypeAlreadyExists = "Seat type already exists",
  InvalidQuery = "Invalid query provided",
}
