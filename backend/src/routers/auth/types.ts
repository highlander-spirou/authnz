export type AccessTokenPayload = {
  id: number
  sessionId: number
}

export type NewUserMagicLinkPayload = {
  email: string
}

export type ForgotPasswordPayload = {
  email: string
}
