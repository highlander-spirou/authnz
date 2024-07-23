import { env } from "@lib/env"
import ms from "ms"
import { createClient } from "redis"

const client = await createClient({ password: env.REDIS_PASSWORD })
	.on("error", (err) => console.log("Redis Client Error", err))
	.connect()

export default {
	get: async (key: string) => {
		return await client.get(key)
	},
	set: async (key: string, value: string) => {
		return await client.set(key, value, {
			EX: ms(`${env.REFRESH_TOKEN_TTL_DAY} days`) / 1000,
		})
	},
}
