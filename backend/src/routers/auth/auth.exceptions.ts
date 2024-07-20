import { HTTPException } from "../../errors"
export enum AuthExceptionEnum {
	// Login - Register errors
	PasswordNotMatchException = 1,
	EmailNotFoundException = 2,
	DuplicateRegisterEmailException = 3,

	// Verify Email Errors
	EmailAlreadyVerifiedException = 4,
	EmailVerificationRequestMaxException = 5,
	EmailVerificationExpiredException = 6,
	EmailVerificationNotFoundException = 7,

	// Password Reset Errors
	PasswordRequestNotFoundException = 8,
	PasswordRequestMaxException = 9,
	PasswordRequestExpiredException = 10,
	UserEmailNotVerifiedException = 11,
}

interface HTTPError {
	status: number
	message: string
}

export class AuthException extends HTTPException {
	error: AuthExceptionEnum
	constructor(error) {
		super("")
		this.error = error
	}

	public getError(): HTTPError {
		switch (this.error) {
			case 1:
				return { status: 404, message: "Password Not Match" }
			case 2:
				return { status: 404, message: "Email Not Found" }
			case 3:
				return { status: 400, message: "Email Already Existed" }
			case 4:
				return { status: 400, message: "Email Already Verified" }
			case 5:
				return { status: 400, message: "Illegal Email Verification Request" }
			case 6:
				return { status: 400, message: "Email Verification Request Expired" }
			case 7:
				return { status: 404, message: "Email Verification Token Not Found" }
			case 8:
				return { status: 404, message: "Password Reset Token Not Found" }
			case 9:
				return { status: 400, message: "Illegal Password Request" }
			case 10:
				return { status: 400, message: "Password Reset Request Expired" }
			case 11:
				return { status: 401, message: "User Email Not Verified" }

			default:
				return { status: 500, message: "Unknown error" }
		}
	}
}
