import { z } from "zod"

export const putEmailDTO = z.object({
	email: z.string().email(),
})

export type putEmailProps = z.infer<typeof putEmailDTO>
