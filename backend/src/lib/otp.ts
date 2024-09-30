import * as OTPAuth from "otpauth"
import env from "./env"

export const generateTOTP = ({
  userSecretBase32,
  label,
}: {
  userSecretBase32: OTPAuth.Secret
  label: string
}) => {
  return new OTPAuth.TOTP({
    issuer: env.APP_NAME,
    label: label,
    digits: 6,
    secret: userSecretBase32,
  })
}
