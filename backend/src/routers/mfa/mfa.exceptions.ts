import { HTTPException, type HTTPErrorType } from "@lib/http/errors"

export enum MFAExceptionEnum {
  UnknownError = "UnknownError",
  TOTPInvalid = "TOTPInvalid",
  TOTPTimeout = "TOTPTimeout",
  TOTPRegistered = "TOTPRegistered",
}

export class MFAException extends HTTPException {
  error: MFAExceptionEnum
  constructor(error) {
    super("")
    this.error = error
  }

  public getError(): HTTPErrorType {
    switch (this.error) {
      case MFAExceptionEnum.TOTPInvalid:
        return { status: 400, message: "TOTP invalid" }
      case MFAExceptionEnum.TOTPTimeout:
        return { status: 400, message: "TOTP Timeout" }
      case MFAExceptionEnum.TOTPRegistered:
        return { status: 400, message: "TOTP Has been registered" }
      default:
        return { status: 500, message: "Unknown error" }
    }
  }
}
