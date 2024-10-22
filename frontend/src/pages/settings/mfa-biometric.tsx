import { startRegistration, WebAuthnError } from "@simplewebauthn/browser"
import { Button } from "@/components/ui/button"
import {
  cancelChallengeOption,
  getBiometricRegOptOption,
  getBiometricStatusOption,
  verifyRegDeviceOption,
} from "@mfa/queries/options"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CircleCheckBigIcon } from "lucide-react"
import queryClient from "@/query-client"

type BiometricErrors = "BiometricCancelled" | "ChallengeConflicted"

const MFA_Biometrics = () => {
  const { data: biometricStatus } = useQuery({
    queryKey: getBiometricStatusOption.key,
    queryFn: getBiometricStatusOption.fn,
    staleTime: getBiometricStatusOption.staleTime,
  })

  const [isLoading, toggleLoading] = useState(false)

  const {
    data,
    error,
    isFetching: getChallengeLoading,
    refetch,
  } = useQuery({
    queryKey: getBiometricRegOptOption.key,
    queryFn: getBiometricRegOptOption.fn,
    staleTime: getBiometricRegOptOption.staleTime,
    enabled: false,
    retry: false,
  })


  const {
    refetch: cancelChallengeTrigger,
    isFetching: cancelChallengeLoading,
  } = useQuery({
    queryKey: cancelChallengeOption.key,
    queryFn: cancelChallengeOption.fn,
    staleTime: cancelChallengeOption.staleTime,
    enabled: false,
  })

  useEffect(() => {
    if (cancelChallengeLoading || getChallengeLoading) {
      toggleLoading(true)
    } else {
      toggleLoading(false)
    }
  }, [cancelChallengeLoading, getChallengeLoading])

  const [biometricError, setBiometricError] = useState<BiometricErrors | null>(
    null
  )
  const { mutateAsync } = useMutation({
    mutationKey: verifyRegDeviceOption.key,
    mutationFn: verifyRegDeviceOption.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getBiometricStatusOption.key,
      })
    },
    retry: false,
  })

  const handleBiometricRegistration = async () => {
    try {
      setBiometricError(null)
      const attestationResponse = await startRegistration(data)
      mutateAsync(attestationResponse)
    } catch (error) {
      console.log(error)
      if (error instanceof WebAuthnError) {
        setBiometricError("BiometricCancelled")
        cancelChallengeTrigger()
      }
    }
  }

  useEffect(() => {
    if (data) {
      handleBiometricRegistration()
    }
  }, [data])

  if (biometricStatus?.status) {
    return (
      <>
        <div className="restrict-content-grow mt-10">
          <CircleCheckBigIcon className="stroke-green-500" />
          <p>This device has successfully register biometric authentication</p>
          <Button variant="link">
            <Link to="/settings" className="w-full">
              Back to settings
            </Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="restrict-content-grow">
        <div className="grid place-items-center mt-10">
          {biometricError === "BiometricCancelled" && (
            <>
              <p className="text-red-500 my-5 font-semibold">
                You have cancel the biometric verification process. Click the
                button to retry
              </p>
              {isLoading && <p>Cleaning up, please wait ...</p>}
            </>
          )}
          <Button onClick={() => refetch()} disabled={isLoading}>
            Start biometrics verification
          </Button>
        </div>
      </div>
    </>
  )
}

export default MFA_Biometrics
