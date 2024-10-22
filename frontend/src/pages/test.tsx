import { Button } from "@/components/ui/button"
import {
  getBiometricAuthOptOption,
  verifyBiometricAuthOption,
} from "@mfa/queries/options"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FingerprintIcon, LockKeyholeOpenIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { startAuthentication } from "@simplewebauthn/browser"

type MenuSelection = "biometric" | "otp"

const NullMenu = ({ selectMenu }) => {
  return (
    <>
      <div className="restrict-content-grow mt-10">
        <div className="flex flex-col items-center">
          <h3>Multifactor Authentication</h3>
          <p>This action requires verification via MFA</p>
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

const BiometricMenu = ({ selectMenu }) => {
  const { data: challenge, refetch } = useQuery({
    queryKey: getBiometricAuthOptOption.key,
    queryFn: getBiometricAuthOptOption.fn,
    retry: false,
    enabled: false,
  })

  const { mutateAsync } = useMutation({
    mutationFn: verifyBiometricAuthOption.fn,
    retry: false,
  })

  useEffect(() => {
    console.log("challenge", challenge)
  }, [challenge])

  const handler = async () => {
    const assertionResponse = await startAuthentication(challenge)
    console.log("assertionResponse", assertionResponse)
    await mutateAsync({ payload: assertionResponse })
  }

  useEffect(() => {
    if (challenge) {
      handler()
    }
  }, [challenge])

  return (
    <>
      <div className="restrict-content-grow mt-10">
        <div className="flex flex-col items-center">
          <p>You have chosen Biometrics as the authentication method.</p>
          <Button onClick={() => refetch()}>Start verification</Button>
          <Button
            variant="link"
            className="text-blue-600"
            onClick={() => selectMenu(null)}
          >
            Back
          </Button>
        </div>
      </div>
    </>
  )
}

const TestPage = () => {
  const [menu, selectMenu] = useState<MenuSelection | null>(null)

  if (!menu) {
    return <NullMenu selectMenu={selectMenu} />
  } else if (menu === "biometric") {
    return <BiometricMenu selectMenu={selectMenu} />
  }
}

export default TestPage
