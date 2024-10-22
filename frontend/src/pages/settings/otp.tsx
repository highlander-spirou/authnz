import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  deleteOTPOption,
  generateOTPOptions,
  getOTPStatusOptions,
  registerOTPOption,
} from "@mfa/queries/options"
import { OTPStatus } from "@mfa/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"

const DisableOTP = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteOTPOption.fn,
    onSuccess: () => {
      deleteOTPOption.invalidates()
    },
  })

  return (
    <>
      <div className="restrict-content-grow flex flex-col items-center justify-center mt-10">
        <h2 className="text-green-500">OTP has been registered</h2>
        <div className="flex gap-5 mt-5">
          <Link to="/settings" className="w-full">
            <Button variant="outline">Return to settings</Button>
          </Link>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate()}
          >
            Disable TOTP
          </Button>
        </div>
      </div>
    </>
  )
}

const RegisterOTP = () => {
  const [valueOTP, setValueOTP] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { data: qrData, isFetching } = useQuery({
    queryKey: generateOTPOptions.key,
    queryFn: generateOTPOptions.fn,
    staleTime: generateOTPOptions.staleTime,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: registerOTPOption.fn,
    onSuccess: () => {
      registerOTPOption.invalidates()
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message)
      }
    },
  })

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({ otp: valueOTP })
  }

  return (
    <>
      <div className="restrict-content-grow flex flex-col items-center justify-center mt-10">
        <p className="text-sm leading-normal mt-1 text-gray-600">
          Prepare a smartphone with{" "}
          <span className="font-bold">Google Authenticator</span> application
          installed. Scan the following QR code using your phone's authenticator
          application (or enter the setup key) and enter the 6-digit code from
          the authentication app.
        </p>

        {isFetching ? (
          <>
            <Skeleton className="w-56 h-56 aspect-auto" />
          </>
        ) : (
          <>
            <img
              src={qrData.qrCode}
              alt="qrCode"
              className="w-56 aspect-auto"
            />
            <p className="ml-3">
              Setup Key:{" "}
              <span className="font-semibold">{qrData.userSecretBase32}</span>
            </p>
            <div className="mt-5">
              <form onSubmit={submitHandler}>
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
                {error && (
                  <p className="mt-5 font-semibold text-sm text-red-600">
                    {error}
                  </p>
                )}
                <Button
                  className="mt-5 w-48"
                  type="submit"
                  disabled={isPending}
                >
                  Verify & Activate OTP
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  )
}

const RegisterOrDisableOTP = () => {
  const { data: otpStatus } = useQuery<OTPStatus>({
    queryKey: getOTPStatusOptions.key,
    queryFn: getOTPStatusOptions.fn,
    staleTime: getOTPStatusOptions.staleTime,
  })

  if (otpStatus?.status) {
    return <DisableOTP />
  }

  return <RegisterOTP />
}

export default RegisterOrDisableOTP
