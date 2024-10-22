import { z } from "zod"

export const verifyTOTPDTO = z.object({
  otp: z.string().length(6),
})

export const getMfaTzDTO = z.object({
  token: z
    .string()
    .regex(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    ),
})
