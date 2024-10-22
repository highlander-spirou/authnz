import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import {
  getBiometricStatusOption,
} from "@mfa/queries/options"
import type { BiometricStatus, OTPStatus } from "@mfa/types"

import { BadgeCheckIcon, TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardLayout, CardContent, CardTitle } from "@/components/layouts"

const BiometricsSection = () => {
  const { data: biometricStatus } = useQuery<BiometricStatus>({
    queryKey: getBiometricStatusOption.key,
    queryFn: getBiometricStatusOption.fn,
    staleTime: getBiometricStatusOption.staleTime,
  })

  return (
    <CardLayout id="biometrics">
      <CardTitle
        title="Biometrics Authentication"
        description="Add additional security to your account using biometrics authentication (Recommend)."
      ></CardTitle>
      <CardContent>
        {biometricStatus?.status ? (
          <>
            <h4 className="text-lg font-medium flex items-center gap-1 text-green-600">
              <span>
                <BadgeCheckIcon className="w-5 h-5" />
              </span>
              You have enabled biometric for this device.
            </h4>
            <div className="w-full flex justify-end mt-5">
              <Link to="/settings/mfa-biometric">
                <Button variant="destructive">Disable Biometric</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h4 className="text-lg font-medium flex gap-1 text-red-500">
              <span>
                <TriangleAlertIcon />
              </span>
              You have not enabled biometric for this device.
            </h4>
            {!window.PublicKeyCredential ? (
              <>
                <p className="text-sm leading-normal mt-1 text-gray-600">
                  This device DOES NOT support biometric authentication, so you
                  should use OTP for Multi-factor authentication
                </p>
              </>
            ) : (
              <>
                <p className="text-sm leading-normal mt-1 text-gray-600">
                  This device support biometric authentication. We strongly
                  recommend you to register a biometric for all of your devices
                  to secure your account
                </p>
                <div className="mt-5 w-full flex justify-end">
                  <Link to="/settings/mfa-biometric">
                    <Button>Register Biometrics</Button>
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </CardLayout>
  )
}

export default BiometricsSection
