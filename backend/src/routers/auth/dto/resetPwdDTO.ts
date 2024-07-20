import { z } from "zod";

export const resetPwdDTO = z.object({
  password: z.string().min(1),
});
