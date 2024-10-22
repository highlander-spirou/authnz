import { HTTPException, type HTTPErrorType } from "@lib/http/errors"

export enum MFAExceptionEnum {
  UnknownError = "UnknownError",

  MfaNotVerified = "MfaNotVerified",
  MfaTokenTimeout = "MfaTokenTimeout",

  // #region OTP
  OtpBase32Invalid = "OtpBase32Invalid",
  TOTPInvalid = "TOTPInvalid",
  TOTPTimeout = "TOTPTimeout",
  TOTPRegistered = "TOTPRegistered",
  // #endregion

  // #region Biometric
  ChallengeConflicted = "ChallengeConflicted",
  SessionRegistered = "SessionRegistered",
  RegisterBiometricFails = "RegisterBiometricFails",
  ProvideChallengeFail = "ProvideChallengeFail",
  BiometricAuthFail = "BiometricAuthFail",
  // #endregion
}

export class MFAException extends HTTPException {
  error: MFAExceptionEnum
  constructor(error) {
    super("")
    this.error = error
  }

  public getError(): HTTPErrorType {
    switch (this.error) {
      case MFAExceptionEnum.MfaNotVerified:
        return {
          status: 400,
          message: "User has not verify multi-factor authentication",
        }
      case MFAExceptionEnum.MfaTokenTimeout:
        return {
          status: 400,
          message: "Multi-factor authentication token timeout",
        }
      // #region OTP
      case MFAExceptionEnum.OtpBase32Invalid:
        return {
          status: 404,
          message: "OTP Base32 not found. Must generate QR Code before verify",
        }
      case MFAExceptionEnum.TOTPRegistered:
        return { status: 400, message: "TOTP Has been registered" }
      case MFAExceptionEnum.TOTPInvalid:
        return { status: 400, message: "TOTP invalid" }
      case MFAExceptionEnum.TOTPTimeout:
        return { status: 400, message: "TOTP Timeout" }
      // #endregion

      // #region Biometric
      case MFAExceptionEnum.ChallengeConflicted:
        return { status: 400, message: "Challenge is conflicted" }
      case MFAExceptionEnum.RegisterBiometricFails:
        return { status: 400, message: "Fails to register biometrics" }
      case MFAExceptionEnum.SessionRegistered:
        return { status: 400, message: "Device already register biometrics" }
      case MFAExceptionEnum.BiometricAuthFail:
        return { status: 400, message: "Fail to authentication via biometrics" }
      case MFAExceptionEnum.ProvideChallengeFail:
        return {
          status: 400,
          message: "Cannot create option for biometric authentication",
        }
      // #endregion

      default:
        return { status: 500, message: "Unknown error" }
    }
  }
}
