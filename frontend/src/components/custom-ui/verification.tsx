import React, { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import {
  FingerprintIcon,
  LockKeyholeOpenIcon,
  RectangleEllipsisIcon,
  ScanFaceIcon,
} from "lucide-react"
import useLocalStorage from "@/lib/hooks/useLocalStorage"
import { useMutation } from "@tanstack/react-query"
import {
  getBiometricAuthOptOption,
  verifyBiometricAuthOption,
  verifyOTPOption,
} from "@mfa/queries/options"
import { startAuthentication, WebAuthnError } from "@simplewebauthn/browser"
import { cn } from "@/lib/utils"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp"
import { useGlobalContext } from "@/context"
import { MfaVerification } from "@/types"
import { AxiosError } from "axios"

type MenuSelection = "biometric" | "otp"
type ResponseError = "UserCanceled" | "ChallengeError" | "VerifyError"

const SelectMethodMenu = ({ selectMenu }) => {
  return (
    <>
      <div className="restrict-content-grow mt-10">
        <div className="flex flex-col items-center">
          <h3>Multifactor Authentication</h3>
          <p>Please choose one of the following method to continue</p>
          <div className="grid gap-5 mt-5">
            <Button
              variant="outline"
              className="w-60 gap-2"
              onClick={() => {
                selectMenu("biometric")
              }}
            >
              <FingerprintIcon className="w-5 h-5" />
              Biometrics
            </Button>
            <Button
              variant="outline"
              className="w-60 gap-2"
              onClick={() => {
                selectMenu("otp")
              }}
            >
              <LockKeyholeOpenIcon className="w-5 h-5" />
              OTP
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

type MenuProps = {
  toggleOpen: React.Dispatch<boolean>
  onVerifiedSuccessHandler?: () => void
}

const BiometricMenu = ({ toggleOpen, onVerifiedSuccessHandler }: MenuProps) => {
  const [error, setError] = useState<ResponseError | null>(null)
  const [shouldCloseDialog, setShouldCloseDialog] = useState(false)
  const { setMfaToken } = useGlobalContext()

  const {
    data: challenge,
    mutate: fetchChallenge,
    isPending,
  } = useMutation({
    mutationFn: getBiometricAuthOptOption.fn,
    retry: false,
    onError: () => {
      setError("ChallengeError")
    },
  })

  const { data: biometricVerifyResult, mutateAsync } = useMutation<
    MfaVerification,
    any,
    { payload: any }
  >({
    mutationFn: verifyBiometricAuthOption.fn,
    retry: false,
    onSuccess: (result) => {
      setMfaToken(result.token)
      setShouldCloseDialog(true)
      verifyBiometricAuthOption.invalidates()

      // Invoke onSuccess hook
      if (onVerifiedSuccessHandler) {
        onVerifiedSuccessHandler()
      }
    },
    onError: () => {
      setError("VerifyError")
    },
  })

  const handler = async () => {
    try {
      setError(null)
      const assertionResponse = await startAuthentication(challenge)
      mutateAsync({ payload: assertionResponse })
    } catch (error) {
      if (error instanceof WebAuthnError) {
        setError("UserCanceled")
      }
    }
  }

  useEffect(() => {
    if (challenge) {
      handler()
    }
  }, [challenge])

  useEffect(() => {
    if (shouldCloseDialog) {
      setTimeout(() => {
        toggleOpen(false)
      }, 3000)
    }
  }, [shouldCloseDialog])

  return (
    <>
      <div className="restrict-content-grow mt-10">
        <div className="flex flex-col items-center">
          <h3>Biometrics authentication</h3>
          <ScanFaceIcon className="size-20 stroke-gray-500" />
          {error && (
            <p className="mt-5 text-red-500 font-semibold">
              {error === "UserCanceled"
                ? "You have canceled the operation!"
                : error === "ChallengeError"
                ? "Server error, please try another method or retry later"
                : "Authentication failed, the server couldn't regconize this biometric"}
            </p>
          )}
          {shouldCloseDialog && (
            <>
              <div className="text-center mt-5">
                <p className="font-medium text-green-500">
                  You have successfully verified.
                </p>
                <p>
                  Click the <span className="font-bold">Cancel</span> button to
                  close this dialog
                </p>
                <p className="text-sm italic">
                  This dialog will automatically closed after 3 seconds
                </p>
              </div>
            </>
          )}
          <Button
            onClick={() => fetchChallenge()}
            className={cn(
              "mt-5",
              challenge || biometricVerifyResult ? "hidden" : ""
            )}
            disabled={isPending}
          >
            Start verification
          </Button>
        </div>
      </div>
    </>
  )
}

const OTPMenu = ({ toggleOpen, onVerifiedSuccessHandler }: MenuProps) => {
  const [valueOTP, setValueOTP] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [shouldCloseDialog, setShouldCloseDialog] = useState(false)
  const { setMfaToken } = useGlobalContext()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: verifyOTPOption.fn,
    retry: false,
    onSuccess: (result) => {
      setMfaToken(result.token)
      setShouldCloseDialog(true)
      verifyOTPOption.invalidates()

      // Invoke onSuccess hook
      if (onVerifiedSuccessHandler) {
        onVerifiedSuccessHandler()
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setError(error.response?.data.message!)
    },
  })

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await mutateAsync({ otp: valueOTP })
  }

  useEffect(() => {
    if (shouldCloseDialog) {
      setTimeout(() => {
        toggleOpen(false)
      }, 3000)
    }
  }, [shouldCloseDialog])

  return (
    <div className="restrict-content-grow mt-10">
      <div className="flex flex-col items-center">
        <h3>Time-based OTP Authentication</h3>
        <RectangleEllipsisIcon className="size-20 stroke-gray-500" />
        <p className="text-sm">
          Open <span className="font-bold">Google authenticator</span> and enter
          the 6-digit OTP
        </p>
        {error && <p className="mt-5 text-red-500 font-semibold">{error}</p>}
        {!shouldCloseDialog ? (
          <>
            <form onSubmit={(e) => submitHandler(e)} id="otp-verify-form">
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
            </form>
            <Button
              type="submit"
              form="otp-verify-form"
              className="mt-5"
              disabled={isPending}
            >
              Verify OTP
            </Button>
          </>
        ) : (
          <>
            <div className="text-center mt-5">
              <p className="font-medium text-green-500">
                You have successfully verified.
              </p>
              <p>
                Click the <span className="font-bold">Cancel</span> button to
                close this dialog
              </p>
              <p className="text-sm italic">
                This dialog will automatically closed after 3 seconds
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const VerifyMfaDialog = ({
  open,
  toggleOpen,
  onVerifiedSuccessHandler,
}: {
  open: boolean
  toggleOpen: React.Dispatch<boolean>
  onVerifiedSuccessHandler?: () => void
}) => {
  const [menu, selectMenu] = useLocalStorage<MenuSelection | null>(
    "prefer_mfa_method",
    "biometric"
  )

  return (
    <>
      <AlertDialog open={open} onOpenChange={toggleOpen}>
        <AlertDialogContent className="">
          {!menu && (
            <>
              <SelectMethodMenu selectMenu={selectMenu} />
            </>
          )}
          {menu === "biometric" && (
            <>
              <BiometricMenu
                toggleOpen={toggleOpen}
                onVerifiedSuccessHandler={onVerifiedSuccessHandler}
              />
            </>
          )}
          {menu === "otp" && (
            <>
              <OTPMenu
                toggleOpen={toggleOpen}
                onVerifiedSuccessHandler={onVerifiedSuccessHandler}
              />
            </>
          )}
          <AlertDialogFooter>
            <Button
              variant="link"
              className={cn("text-blue-600", !menu ? "hidden" : "")}
              onClick={() => selectMenu(null)}
            >
              Change method
            </Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default VerifyMfaDialog
