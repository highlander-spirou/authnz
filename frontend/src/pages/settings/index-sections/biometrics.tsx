import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { getOTPStatusOptions } from "@mfa/queries/options"
import type { OTPStatus } from "@mfa/types"

import { BadgeCheckIcon, TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardLayout, CardContent, CardTitle } from "@/components/layouts"

const BiometricsSection = () => {
  return (
    <CardLayout id="biometrics">
      <CardTitle
        title="Biometrics Authentication"
        description="Add additional security to your account using biometrics authentication (Recommend)."
      ></CardTitle>
      <CardContent>
        <Button>
          <Link to="/settings/mfa-biometric">Register Biometrics</Link>
        </Button>
      </CardContent>
    </CardLayout>
  )
}

export default BiometricsSection
