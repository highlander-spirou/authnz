// Throttle request for development

import env from "@lib/env"
import type { Response } from "express"

function generateRandomNumber() {
  const min = 1000
  const max = 7000
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const throttleResponse = ({
  res,
  payload,
  status,
  delay,
}: {
  res: Response
  status: number
  payload: any
  delay?: number
}) => {
  if (env.ENVIRONMENT === "dev" && env.SHOULD_THROTTLE) {
    const throttle = delay || generateRandomNumber()
    console.log("Response throttle for ", throttle)

    return new Promise((resolve) => {
      setTimeout(() => {
        res.status(200).json({ message: "OKAY" })
      }, throttle)
    })
  }

  return res.status(status).json(payload)
}

export default throttleResponse
