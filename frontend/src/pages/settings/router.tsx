import { RouteObject } from "react-router-dom"
import SettingsPage from "."
import DeviceLocation, {
  action as deviceLocationAction,
} from "./device-location"
import queryClient from "@/query-client"
import RegisterOrDisableOTP from "./otp"
import RegisterOrDisableBiometric from "./biometrics"



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
      path: "otp",
      element: <RegisterOrDisableOTP />,
    },
    {
      path: "biometric",
      element: <RegisterOrDisableBiometric />,
    },
  ],
}

export default settingsRouter
