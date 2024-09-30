import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { formSerialize } from "@/lib/form-serializer"
import { verifyOTPRequest } from "@mfa/queries/fetcher"
import {
  generateOTPOptions,
  getOTPStatusOptions,
  verifyOTPOption,
} from "@mfa/queries/options"
import mfaKeys from "@mfa/queries/queryKeyFactories"
import { OTPData, OTPStatus } from "@mfa/types"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useState } from "react"
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSubmit,
} from "react-router-dom"

export const loader = (queryClient: QueryClient) => async () => {
  try {
    const status = await queryClient.ensureQueryData<OTPStatus>({
      queryKey: getOTPStatusOptions.key,
      queryFn: getOTPStatusOptions.fn,
    })
    // OTP has been activated
    if (status.status) {
      return null
    }
    // OTP has not been activated => get the QR code from server
    const qrData = await queryClient.ensureQueryData<OTPData>({
      queryKey: generateOTPOptions.key,
      queryFn: generateOTPOptions.fn,
    })
    return qrData || null
  } catch (error) {
    return "Unknown error"
  }
}

export const action =
  (queryClient: QueryClient) =>
  async ({ request }) => {
    if (request.method !== "POST") {
      throw new Response("", { status: 405 })
    }
    try {
      const payload = await formSerialize(request)
      console.log("payload", payload)
      await verifyOTPRequest(payload)
      queryClient.invalidateQueries({ queryKey: mfaKeys.status })
      location.replace("/settings")
      return null
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data.message
      } else {
        return "Unknown error"
      }
    }
  }

const MFA_OTP = () => {
  const submit = useSubmit()
  const otpData = useLoaderData() as null | OTPData
  const [valueOTP, setValueOTP] = useState("")

  const error = useActionData() as string | null

  const submitHandler = () => {
    submit(
      { formData: JSON.stringify({ otp: valueOTP }) },
      { method: "POST", action: "" }
    )
  }

  if (!otpData) {
    return (
      <>
        <div className="restrict-content-grow flex flex-col items-center justify-center mt-10">
          <h2>OTP has been registered</h2>
          <p>
            This application needs at least one{" "}
            <span className="font-semibold">
              Multi-factor Authentication method
            </span>
            . To disable the TOTP feature, first you must register the{" "}
            <span className="font-semibold">biometric authentication</span> on
            the current device
          </p>
          <div className="flex gap-5 mt-5">
            <Button variant="outline">
              <Link to="/settings" className="w-full">
                Return to settings
              </Link>
            </Button>
            <Button variant="destructive">Disable TOTP</Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="restrict-content-grow flex flex-col items-center justify-center mt-10">
      <p className="text-sm leading-normal mt-1 text-gray-600">
        Prepare a smartphone with{" "}
        <span className="font-bold">Google Authenticator</span> application
        installed. Scan the following QR code using your phone's authenticator
        application (or enter the setup key) and enter the 6-digit code from the
        authentication app.
      </p>
      <img src={otpData.qrCode} alt="qrCode" className="w-56 aspect-auto" />
      <p className="ml-3">
        Setup Key:{" "}
        <span className="font-semibold">{otpData.userSecretBase32}</span>
      </p>
      <div className="mt-5">
        <Form onSubmit={submitHandler}>
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
          <Button className="mt-5 w-48">Verify & Activate OTP</Button>
        </Form>
      </div>
    </div>
  )
}

export default MFA_OTP
