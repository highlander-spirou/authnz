import env from "@lib/env"
import prisma from "@lib/prisma"
import { getMfaTzDTO } from "@mfa/mfa.dto"
import { MFAException, MFAExceptionEnum } from "@mfa/mfa.exceptions"
import dayjs from "dayjs"
import type { Request } from "express"

export const getVerifyTz = async (req: Request) => {
  const userId = req.context.userId
  const { token } = await getMfaTzDTO.parseAsync(req.body)

  const data = await prisma.$transaction(async (tx) => {
    const validToken = await tx.mfaVerifyStatus.findFirst({
      where: { AND: [{ user_id: userId }, { uuid: token }] },
      select: { uuid_ttl: true },
    })

    if (!validToken || !validToken.uuid_ttl) {
      throw new MFAException(MFAExceptionEnum.MfaNotVerified)
    }

    if (
      dayjs().diff(dayjs(validToken.uuid_ttl), "minutes") >=
      env.MFA_UUID_TTL_MINUTES
    ) {
      throw new MFAException(MFAExceptionEnum.MfaTokenTimeout)
    }

    return validToken.uuid_ttl
  })

  return { tz: data }
}
