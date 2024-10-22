import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const env = createEnv({
  server: {
    // App information
    PORT: z.coerce.number().optional(),
    ENVIRONMENT: z.enum(["dev", "prod"]),
    APP_NAME: z.string(),
    APP_DOMAIN: z.string(),
    SHOULD_THROTTLE: z
      .string()
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "true"),

    // Databases
    REDIS_PASSWORD: z.string(),

    // Secrets
    SIGNUP_HASH: z.string(),
    JWT_SECRET_KEY: z.string(),
    PSEUDO_PASSWORD: z.string(),

    // TTL
    REFRESH_TOKEN_TTL_DAY: z.coerce.number(),
    ACCESS_TOKEN_TTL_HOUR: z.coerce.number(),
    INVITE_USER_TTL_HOURS: z.coerce.number(),
    RESET_PASSWORD_TTL_HOURS: z.coerce.number(),
    MFA_UUID_TTL_MINUTES: z.coerce.number(),

    // Email
    APP_EMAIL: z.string(),
    MAILTRAP_USER: z.string(),
    MAILTRAP_PWD: z.string(),
  },
  runtimeEnv: process.env,
})

export default env
