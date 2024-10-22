import queryClient from "@/query-client"
import userKeys from "./queryKeyFactories"
import * as Fetcher from './fetcher'
import env from "@/lib/env"

export const getUserInfoOptions = {
  key: userKeys.info,
  fn: Fetcher.getInfoRequest,
  staleTime: env.REACT_ROUTER_STALE_TIME,
}

export const getDeviceLocationOptions = {
  key: userKeys.deviceLocation,
  fn: Fetcher.getDeviceLocationRequest,
  staleTime: env.REACT_ROUTER_STALE_TIME,
}

export const getDeviceSessionsOptions = {
  key: userKeys.devices,
  fn: Fetcher.getDeviceSessionRequest,
  staleTime: env.REACT_ROUTER_STALE_TIME,
}

export const changeUserInfoOptions = {
  key: userKeys.info,
  fn: Fetcher.changeInfoRequest,
  invalidates: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.info })
  },
}
