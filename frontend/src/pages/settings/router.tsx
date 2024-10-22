import { RouteObject } from "react-router-dom"
import SettingsPage from "."
import DeviceLocation, {
  action as deviceLocationAction,
} from "./device-location"
import queryClient from "@/query-client"
import MFA_OTP from "./mfa-otp"
import MFA_Biometrics from "./mfa-biometric"
import Error from "../../error"

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
    },
    {
      path: "mfa-biometric",
      element: <MFA_Biometrics />,
    },
  ],
}

export default settingsRouter
