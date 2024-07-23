import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
	server: {
		// App parameter
		PORT: z.coerce.number().optional(),
		HTTP_SCHEME: z.string(),
		APP_DOMAIN: z.string(),

		// Database
		DATABASE_URL: z.string(),
		REDIS_PASSWORD: z.string(),

		// Session Token
		JWT_SECRET_KEY: z.string(),
		ACCESS_TOKEN_TTL_MINUTE: z.coerce.number(),
		REFRESH_TOKEN_TTL_DAY: z.coerce.number(),

		// Email verification
		EMAIL_VERIFY_EXPIRED_HOUR: z.coerce.number(),
		MAX_VERIFY_EMAIL_RETRIES: z.coerce.number(),
		MAX_VERIFY_EMAIL_PENALTY_HOUR: z.coerce.number(),

		// Email sending
		APP_EMAIL: z.string(),
		MAILTRAP_USER: z.string(),
		MAILTRAP_PWD: z.string(),

		// Password reset
		PASSWORD_RESET_EXPIRED_HOUR: z.coerce.number(),
		MAX_PASSWORD_RETRIES: z.coerce.number(),
		MAX_PASSWORD_RETRIES_PENALTY_HOUR: z.coerce.number(),
	},
	runtimeEnv: process.env,
})
