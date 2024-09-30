import { z } from "zod"

export const loginDTO = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type loginDTOProps = z.infer<typeof loginDTO>
