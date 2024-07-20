import { z } from "zod"

export const putPasswordDTO = z.object({
	currentPassword: z.string().min(1),
	newPassword: z.string().min(1),
})

export type putPasswordProps = z.infer<typeof putPasswordDTO>
