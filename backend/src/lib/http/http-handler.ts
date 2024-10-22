import { ZodError } from "zod"
import { HTTPException, type HTTPErrorType } from "./errors"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const HTTPHandler = async <T>(
  callbackFn: () => Promise<T>
): Promise<{ data: T; error: null } | { data: null; error: HTTPErrorType }> => {
  try {
    const data = await callbackFn()
    return { data, error: null }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        data: null,
        error: {
          status: 400,
          message: { invalidPayload: error.issues },
        },
      }
    } else if (error instanceof HTTPException) {
      return { data: null, error: error.getError() }
    } else if (error instanceof PrismaClientKnownRequestError) {
      console.log("error", error)
      return {
        data: null,
        error: { status: 500, message: "Internal Service Error" },
      }
    } else {
      console.log("error", error)
      return { data: null, error: { status: 500, message: "Unknown Error" } }
    }
  }
}

export default HTTPHandler
