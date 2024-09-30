import { generateOTP, getOTPStatus } from "@mfa/queries/options"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CardContent, CardLayout, CardTitle } from "@user/layouts"
import { OTPStatus } from "@mfa/types"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"

const MFA = () => {
  const { data: OTPStatus } = useQuery<OTPStatus>(getOTPStatus.options())
  const { data: otpData, refetch, isFetching } = useQuery(generateOTP.options())

  const [valueOTP, setValueOTP] = useState("")

  useEffect(() => {
    console.log("valueOTP", valueOTP)
  }, [valueOTP])

  return (
    <CardLayout id="email">
      <>
        <CardTitle
          title="OTP Authentication"
          description="Add additional security to your account using Time-based One-time Password (TOTP)."
        ></CardTitle>
        <CardContent>
          <h4 className="text-lg font-medium">
            {OTPStatus?.status
              ? "You have enabled TOTP."
              : "You have not enabled TOTP."}
          </h4>
          {OTPStatus?.status ? (
            <p>
              When ask for a TOTP, open the device which have Google
              Authenticator app, the input the 6-digit code on the screen to
              proceed
            </p>
          ) : (
            <>
              <p className="text-sm leading-normal mt-1 text-gray-600">
                Prepare a smartphone with{" "}
                <span className="font-bold">Google Authenticator</span>{" "}
                application installed. Scan the following QR code using your
                phone's authenticator application (or enter the setup key) and
                enter the 6-digit code from the authentication app.
              </p>
              {isFetching && <Skeleton className="size-56" />}
              {otpData && (
                <>
                  <img
                    src={otpData.qrCode}
                    alt="qrCode"
                    className="w-56 aspect-auto"
                  />
                  <p className="ml-3">
                    Setup Key:{" "}
                    <span className="font-semibold">
                      {otpData.userSecretBase32}
                    </span>
                  </p>
                  <div className="mt-5">
                    <Label>OTP Code</Label>
                    <InputOTP
                      maxLength={6}
                      value={valueOTP}
                      onChange={(value) => setValueOTP(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </>
              )}

              <div
                className={!otpData ? "mt-5 w-full flex justify-end" : "hidden"}
                onClick={() => refetch()}
              >
                <Button disabled={isFetching}>Activate TOTP</Button>
              </div>
            </>
          )}
          {/* <form onSubmit={(e) => submitHandler(e)}>
            <Label>Name</Label>
            <Input
              placeholder="Enter your name"
              value={inp || ""}
              onChange={(e) => setInp(e.target.value)}
              className="w-2/3"
            />
            {error && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                New name invalid
              </p>
            )}
            <div className="mt-5 w-full flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form> */}
        </CardContent>
      </>
    </CardLayout>
  )
}

export default MFA
