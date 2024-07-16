import { z } from "zod";

export const putInfoDTO = z.object({
  name: z.string(),
});

export type putInfoProps = z.infer<typeof putInfoDTO>;
