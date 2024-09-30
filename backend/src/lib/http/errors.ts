export type HTTPErrorType = {
  status: number
  message: string
}

export abstract class HTTPException extends Error {
  abstract getError(): HTTPErrorType
}
