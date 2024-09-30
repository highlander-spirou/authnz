import mfaKeys from "./queryKeyFactories"
import {
  generateOTPRequest,
  getOTPStatusRequest,
  verifyOTPRequest,
} from "./fetcher"
import queryClient from "@/query-client"

if (!import.meta.env.VITE_REACT_ROUTER_STALE_TIME) {
  throw new Error("No environment variable: REACT_ROUTER_STALE_TIME")
}

export const getOTPStatusOptions = {
  key: mfaKeys.status,
  fn: getOTPStatusRequest,
  staleTime: +import.meta.env.VITE_REACT_ROUTER_STALE_TIME,
}

export const generateOTPOptions = {
  key: mfaKeys.OTPData,
  fn: generateOTPRequest,
  staleTime: +import.meta.env.VITE_REACT_ROUTER_STALE_TIME,
}

export const verifyOTPOption = {
  key: mfaKeys.status,
  fn: verifyOTPRequest,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: mfaKeys.status })
  },
}
