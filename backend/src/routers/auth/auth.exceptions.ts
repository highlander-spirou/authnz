// Login - Register errors
export class PasswordNotMatchException extends Error {}
export class EmailNotFoundException extends Error {}
export class DuplicateRegisterEmailException extends Error {}

// Verify Email Errors
export class EmailAlreadyVerifiedException extends Error {}
export class EmailVerificationRequestMaxException extends Error {}
export class EmailVerificationExpiredException extends Error {}
export class EmailVerificationNotFoundException extends Error {}
