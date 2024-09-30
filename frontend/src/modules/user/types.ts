export type UserInfo = {
  name: string | null
}

export type DeviceLocation = {
  location: string | null
  deviceType: {
    deviceType: string
    operatingSystem: string
    browserType: string
  }
}

export type DeviceSessions = DeviceLocation & {
  latestActivity: string
  isCurrent: boolean
}
