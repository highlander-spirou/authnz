import { z } from "zod"

export const verifyTOTPDTO = z.object({
	otp: z.string().length(6),
})