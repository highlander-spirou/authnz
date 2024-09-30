import { HTTPException } from "@lib/http/errors"

export enum UserExceptionEnum {
  UnknownError = "UnknownError",
}

interface HTTPError {
  status: number
  message: string
}

export class UserException extends HTTPException {
  error: UserExceptionEnum
  constructor(error) {
    super("")
    this.error = error
  }

  public getError(): HTTPError {
    switch (this.error) {
      default:
        return { status: 500, message: "Unknown error" }
    }
  }
}
