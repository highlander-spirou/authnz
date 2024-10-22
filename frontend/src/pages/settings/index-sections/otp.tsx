import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { getOTPStatusOptions } from "@mfa/queries/options"
import type { OTPStatus } from "@mfa/types"

import { BadgeCheckIcon, TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardLayout, CardContent, CardTitle } from "@/components/layouts"

const OTPSection = () => {
  const { data: OTPStatus } = useQuery<OTPStatus>({
    queryKey: getOTPStatusOptions.key,
    queryFn: getOTPStatusOptions.fn,
    staleTime: getOTPStatusOptions.staleTime,
  })

  return (
    <CardLayout id="otp">
      <CardTitle
        title="OTP Authentication"
        description="Add additional security to your account using Time-based One-time Password (TOTP)."
      ></CardTitle>
      <CardContent>
        {OTPStatus?.status ? (
          <>
            <h4 className="text-lg font-medium flex items-center gap-1 text-green-600">
              <span>
                <BadgeCheckIcon className="w-5 h-5" />
              </span>
              You have enabled TOTP.
            </h4>
            <p className="text-sm leading-normal mt-1 text-gray-600">
              When ask for an OTP, open the device which have Google
              Authenticator app, and input the 6-digit code on the screen to
              verify.
            </p>
            <div className="w-full flex justify-end mt-5">
              <Link to="/settings/mfa-otp">
                <Button variant="destructive">Disable OTP</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h4 className="text-lg font-medium flex gap-1 text-red-500">
              <span>
                <TriangleAlertIcon />
              </span>
              You have not enabled TOTP.
            </h4>
            <p className="text-sm leading-normal mt-1 text-gray-600">
              Prepare a smartphone with{" "}
              <span className="font-bold">Google Authenticator</span>{" "}
              application installed. Scan the following QR code using your
              phone's authenticator application (or enter the setup key) and
              enter the 6-digit code from the authentication app.
            </p>
            <div className="mt-5 w-full flex justify-end">
              <Link to="/settings/mfa-otp">
                <Button>Activate OTP</Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </CardLayout>
  )
}

export default OTPSection
