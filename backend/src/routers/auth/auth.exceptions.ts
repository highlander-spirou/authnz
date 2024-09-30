import { HTTPException, type HTTPErrorType } from "@lib/http/errors"

export enum AuthExceptionEnum {
  UnknownError = "UnknownError",

  // Register Admin
  DuplicateEmail = "DuplicateEmail",

  // Login
  EmailNotFound = "EmailNotFound",
  PasswordNotMatch = "PasswordNotMatch",

  // Authentication
  RefreshTokenExpired = "RefreshTokenExpired",
  AccessTokenInvalid = "AccessTokenInvalid",

  // Register User
  VerifyUserTokenExpired = "VerifyUserTokenExpired",
  
  // Reset Password
  ResetPasswordTokenInvalid = "ResetPasswordTokenInvalid",

}

export class AuthException extends HTTPException {
  error: AuthExceptionEnum
  constructor(error) {
    super("")
    this.error = error
  }

  public getError(): HTTPErrorType {
    switch (this.error) {
      case AuthExceptionEnum.DuplicateEmail:
        return { status: 400, message: "Email is already registered" }
      case AuthExceptionEnum.EmailNotFound:
        return { status: 404, message: "Email Not Found" }
      case AuthExceptionEnum.PasswordNotMatch:
        return { status: 400, message: "Incorrect password" }
      case AuthExceptionEnum.RefreshTokenExpired:
        return { status: 401, message: "Login session expired" }
      case AuthExceptionEnum.VerifyUserTokenExpired:
        return { status: 400, message: "Register session timeout" }
      case AuthExceptionEnum.AccessTokenInvalid:
        return { status: 401, message: "Access token invalid" }
      case AuthExceptionEnum.ResetPasswordTokenInvalid:
        return { status: 400, message: "Reset password token invalid" }
      default:
        return { status: 500, message: "Unknown error" }
    }
  }
}
