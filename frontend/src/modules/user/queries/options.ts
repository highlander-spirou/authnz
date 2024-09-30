import queryClient from "@/query-client"
import userKeys from "./queryKeyFactories"
import {
  changeInfoRequest,
  getDeviceLocationRequest,
  getDeviceSessionRequest,
  getInfoRequest,
} from "./fetcher"

if (!import.meta.env.VITE_REACT_ROUTER_STALE_TIME) {
  throw new Error("No environment variable: REACT_ROUTER_STALE_TIME")
}

export const getUserInfoOptions = {
  key: userKeys.info,
  fn: getInfoRequest,
  staleTime: +import.meta.env.VITE_REACT_ROUTER_STALE_TIME,
}

export const getDeviceLocationOptions = {
  key: userKeys.deviceLocation,
  fn: getDeviceLocationRequest,
  staleTime: +import.meta.env.VITE_REACT_ROUTER_STALE_TIME,
}

export const getDeviceSessionsOptions = {
  key: userKeys.devices,
  fn: getDeviceSessionRequest,
  staleTime: +import.meta.env.VITE_REACT_ROUTER_STALE_TIME,
}

export const changeUserInfoOptions = {
  key: userKeys.info,
  fn: changeInfoRequest,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.info })
  },
}
