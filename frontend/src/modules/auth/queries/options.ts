import queryClient from "@/query-client"
import {
  changePwdRequest,
  logoutRequest,
  logoutSessionRequest,
} from "./fetcher"
import userKeys from "@user/queries/queryKeyFactories"

export const logoutSessionOptions = {
  key: userKeys.devices,
  fn: logoutSessionRequest,
  invalidates: () => {
    queryClient.invalidateQueries({
      queryKey: userKeys.devices,
    })
  },
}

export const logoutOptions = {
  key: userKeys.info,
  fn: logoutRequest,
  invalidates: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.info })
  },
}

export const changePasswordOptions = {
  fn: changePwdRequest,
}
