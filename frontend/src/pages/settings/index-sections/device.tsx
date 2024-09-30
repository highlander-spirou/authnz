import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"

import { getDeviceSessionsOptions } from "@user/queries/options"
import { logoutSessionOptions } from "@auth/queries/options"
import { DeviceSessions } from "@user/types"

import { Button } from "@/components/ui/button"
import { CardLayout, CardContent, CardTitle } from "@/components/layouts"
import { LaptopIcon, SmartphoneIcon, TabletSmartphoneIcon } from "lucide-react"

const DeviceIcon = ({
  deviceType,
  className,
}: {
  deviceType: string
  className?: string
}) => {
  switch (deviceType) {
    case "Mobile":
      return <SmartphoneIcon className={className} />
    case "Desktop":
      return <LaptopIcon className={className} />
    default:
      return <TabletSmartphoneIcon className={className} />
  }
}

const calculateOnlineTime = (time) => {
  const timeApart = dayjs(time).diff(dayjs(), "days")
  return timeApart > 0
    ? `${dayjs(time).diff(dayjs(), "days")} day(s) ago`
    : "Currently active"
}

const DeviceSessionsSection = () => {
  const { data } = useQuery<DeviceSessions[]>({
    queryKey: getDeviceSessionsOptions.key,
    queryFn: getDeviceSessionsOptions.fn,
    staleTime: getDeviceSessionsOptions.staleTime,
  })

  const { mutateAsync } = useMutation({
    mutationFn: logoutSessionOptions.fn,
    onSuccess: logoutSessionOptions.onSuccessHandler,
  })

  const deleteHandler = async () => {
    await mutateAsync()
  }

  return (
    <CardLayout id="browser">
      <>
        <CardTitle
          title="Device Sessions"
          description="Manage and log out your active sessions on other devices."
        ></CardTitle>
        <CardContent>
          <div className="grid gap-3">
            {data &&
              data
                .sort((a, b) =>
                  a.isCurrent === b.isCurrent ? 0 : a.isCurrent ? -1 : 1
                )
                .map((x, index) => (
                  <div key={index} className="flex gap-2">
                    <span>
                      <DeviceIcon
                        deviceType={x.deviceType.deviceType}
                        className="w-8 h-8 stroke-gray-500"
                      />
                    </span>
                    <div>
                      <p className="text-sm">
                        {x.deviceType.operatingSystem} -{" "}
                        {x.deviceType.browserType}
                      </p>
                      <p className="text-xs">
                        {x.isCurrent ? (
                          <span className="text-green-600 font-semibold">
                            This device
                          </span>
                        ) : (
                          `${calculateOnlineTime(x.latestActivity)}`
                        )}{" "}
                        - {x.location || "Unknown"}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
          <div className="mt-5 flex justify-between">
            <Button>
              <Link to="/settings/device-location" className="w-full">Change device location</Link>
            </Button>
            <Button variant="destructive" onClick={deleteHandler}>
              Log out other sessions
            </Button>
          </div>
        </CardContent>
      </>
    </CardLayout>
  )
}

export default DeviceSessionsSection
