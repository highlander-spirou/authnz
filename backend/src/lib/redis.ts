import env from "@lib/env"
import ms from "ms"
import { createClient } from "redis"

const client = await createClient({ password: env.REDIS_PASSWORD })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect()

export default {
  get: async (key: string) => {
    return await client.get(key)
  },
  /**
   * Set a key-value pair with TTL in milliseconds
   *
   * @param ttl - Time-to-live in milliseconds.
   */
  set: async (key: string, value: string, ttl: number) => {
    return await client.set(key, value, {
      EX: ttl / 1000,
    })
  },
  del: async (key: string | string[]) => {
    return await client.del(key)
  },
}
