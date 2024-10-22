import type { z } from "zod"

export type HTTPErrorType = {
  status: number
  message: string | {invalidPayload: z.ZodIssue[]}
}

export abstract class HTTPException extends Error {
  abstract getError(): HTTPErrorType
}
