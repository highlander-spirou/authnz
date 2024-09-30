import { HTTPException, type HTTPErrorType } from "@lib/http/errors"

export enum UserExceptionEnum {
  UnknownError = "UnknownError",
}

export class UserException extends HTTPException {
  error: UserExceptionEnum
  constructor(error) {
    super("")
    this.error = error
  }

  public getError(): HTTPErrorType {
    switch (this.error) {
      default:
        return { status: 500, message: "Unknown error" }
    }
  }
}
