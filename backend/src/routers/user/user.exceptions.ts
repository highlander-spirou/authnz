import { HTTPException } from "@lib/http/errors"

export enum UserExceptionEnum {
	UserNotFoundException = 1,
	UserEmailNotVerifiedException = 2,
	UserPwdNotMatchException = 3,
	DuplicatedUserEmailException = 4
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
			case 1:
				return { status: 404, message: "User Not Found" }
			case 2:
				return { status: 401, message: "User Email Not Verified" }
			case 3:
				return { status: 404, message: "User Password Not Match" }
			case 4:
				return { status: 400, message: "Email Already Registered" }

			default:
				return { status: 500, message: "Unknown error" }
		}
	}
}
