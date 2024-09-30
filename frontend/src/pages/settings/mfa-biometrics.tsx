/* export const loader = (queryClient: QueryClient) => async () => {
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
 */

const MFA_Biometrics = () => {
  

  return (
    <></>
  )
}

export default MFA_Biometrics
