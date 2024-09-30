import prisma from "@lib/prisma"
import { changeBrowserLocationDTO } from "@user/DTO"
import type { Request } from "express"

export const updateDeviceLocation = async (req: Request) => {
  const refreshToken = req.cookies["refresh-token"] as string

  const { location } = await changeBrowserLocationDTO.parseAsync(req.body)

  await prisma.loginSession.update({
    where: { refresh_token: refreshToken },
    data: { geolocation: location },
  })
}

export const getDeviceInfo = async (req: Request) => {
  const refreshToken = req.cookies["refresh-token"] as string

  const data = await prisma.loginSession.findFirst({
    where: { refresh_token: refreshToken },
    select: { geolocation: true, browser_info: true },
  })

  if (!data) {
    return null
  }

  const browserInfo = JSON.parse(data?.browser_info)

  return {
    location: data.geolocation,
    deviceType: browserInfo,
  }
}

export const getAllSessions = async (req: Request) => {
  const refreshToken = req.cookies["refresh-token"] as string
  const userId = req.context.userId!

  const allSessions = await prisma.loginSession.findMany({
    where: { user_id: userId },
    select: {
      geolocation: true,
      latest_activity: true,
      browser_info: true,
      refresh_token: true,
    },
  })

  return allSessions.map((sess) => ({
    location: sess.geolocation,
    latestActivity: sess.latest_activity,
    deviceType: JSON.parse(sess.browser_info),
    isCurrent: sess.refresh_token === refreshToken,
  }))
}
