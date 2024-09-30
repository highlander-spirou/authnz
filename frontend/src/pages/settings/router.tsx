import { RouteObject } from "react-router-dom"
import SettingsPage from "."
import DeviceLocation, {
  action as deviceLocationAction,
} from "./device-location"
import queryClient from "@/query-client"
import MFA_OTP, {
  loader as MFA_OTP_Loader,
  action as MFA_OTP_Action,
} from "./mfa-otp"
import MFA_Biometrics from "./mfa-biometrics"

const settingsRouter: RouteObject = {
  path: "settings",
  children: [
    { index: true, element: <SettingsPage /> },
    {
      path: "device-location",
      element: <DeviceLocation />,
      action: deviceLocationAction(queryClient),
    },
    {
      path: "mfa-otp",
      element: <MFA_OTP />,
      loader: MFA_OTP_Loader(queryClient),
      action: MFA_OTP_Action(queryClient),
    },
    {
      path: "mfa-biometric",
      element: <MFA_Biometrics />,
    },
  ],
}

export default settingsRouter
