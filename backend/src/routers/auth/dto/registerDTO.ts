import { z } from "zod"

export const registerDTO = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().optional(),
})
