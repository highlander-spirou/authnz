import type { Request } from "express"

const getOSSys = (os: string) => {
  if (os.toLocaleLowerCase().includes("window")) {
    return "Windows"
  } else if (os.toLocaleLowerCase().includes("mac")) {
    return "MacOS"
  } else if (os.toLocaleLowerCase().includes("android")) {
    return "Android"
  } else if (os.toLocaleLowerCase().includes("ios")) {
    return "iPhone"
  } else if (os.toLocaleLowerCase().includes("linux")) {
    return "Linux"
  } else {
    return "Unknown"
  }
}

export const getBrowserInfo = (req: Request) => {
  if (!req.useragent) {
    throw new Error("express-useragent middleware is not initialized")
  }

  // Get device type
  let deviceType = "Unknown"
  if (req.useragent.isMobile) deviceType = "Mobile"
  else if (req.useragent.isTablet) deviceType = "Tablet"
  else if (req.useragent.isDesktop) deviceType = "Desktop"

  // Get operating system
  const operatingSystem = getOSSys(req.useragent.os)

  // Get browser type
  const browserType = req.useragent.browser || "Unknown"
  return JSON.stringify({
    deviceType,
    operatingSystem,
    browserType,
  })
}
