import { z } from "zod";

export const sendResetPwdDTO = z.object({
  email: z.string().email(),
});
