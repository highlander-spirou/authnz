import { ZodError } from "zod"
import { type HTTPErrorType, HTTPException } from "./errors"

export const HTTPHandler = async <T>(
  callbackFn: () => Promise<T>
): Promise<{ data: T | null; error: HTTPErrorType | null }> => {
  try {
    const data = await callbackFn()
    return { data, error: null }
  } catch (error) {
    if (error instanceof ZodError) {
      return { data: null, error: { status: 400, message: "Payload Error" } }
    } else if (error instanceof HTTPException) {
      return { data: null, error: error.getError() }
    } else {
      return { data: null, error: { status: 500, message: "Unknown Error" } }
    }
  }
}

export default HTTPHandler
