import env from "@lib/env"
import prisma from "@lib/prisma"
import { randomUUID } from "crypto"
import dayjs from "dayjs"

export const update_user_verify_tz = async ({ userId }: { userId: number }) => {
  const uuid = randomUUID()

  const { uuid: createdUUID } = await prisma.mfaVerifyStatus.upsert({
    where: { user_id: userId },
    update: {
      uuid: uuid,
      uuid_ttl: dayjs().add(env.MFA_UUID_TTL_MINUTES, "minutes").toDate(),
    },
    create: {
      user_id: userId,
      uuid: uuid,
      uuid_ttl: dayjs().add(env.MFA_UUID_TTL_MINUTES, "minutes").toDate(),
    },
    select: { uuid: true },
  })
  return createdUUID
}
