import { z } from "zod"

export const createTeamDTO = z.object({
  name: z.string().min(3),
})
