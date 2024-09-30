import queryClient from "@/query-client"
import {
  changePwdRequest,
  logoutRequest,
  logoutSessionRequest,
} from "./fetcher"
import userKeys from "@user/queries/queryKeyFactories"
import { AxiosError } from "axios"

export const logoutSessionOptions = {
  key: userKeys.devices,
  fn: logoutSessionRequest,
  onSuccessHandler: () => {
    queryClient.invalidateQueries({
      queryKey: userKeys.devices,
    })
  },
}

export const logoutOptions = {
  key: userKeys.info,
  fn: logoutRequest,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.info })
    window.location.reload()
  },
}

export const changePasswordOptions = {
  fn: changePwdRequest,
}
