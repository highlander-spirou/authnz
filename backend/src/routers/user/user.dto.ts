import { z } from "zod"

export const changeBrowserLocationDTO = z.object({
  location: z.string(),
})

export const changeUserInfoDTO = z.object({
  name: z.string().min(2),
})
