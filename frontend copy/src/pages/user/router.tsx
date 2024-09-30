import { RouteObject } from "react-router-dom"
import SettingsPage from "./settings"
import BrowserInfo, {
  action as browserInfoAction,
} from "./browser-info"
import queryClient from "@/query-client"
import Team from "./team"

const router: RouteObject[] = [
  {
    path: "/settings",
    children: [
      { index: true, element: <SettingsPage /> },
      {
        path: "browser-info",
        element: <BrowserInfo />,
        action: browserInfoAction(queryClient),
      },
    ],
  },
  {
    path: "/team",
    element: <Team />,
  },
]
export default router
