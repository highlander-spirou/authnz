import dayjs from "dayjs";
import { addTime } from "../../lib";
import { signToken } from "../../lib/hashes/jwt-token";
import { comparePwd, hashPwd } from "../../lib/hashes/pwd-hash";
import { generateToken } from "../../lib/hashes/token-gen";
import prisma from "../../lib/prisma";
import * as AuthExceptions from "./auth.exceptions";
import { LoginSignedToken } from "./types";

const service = {
  login: async (email: string, password: string) => {
    const existedEmail = await prisma.user.findFirst({
      where: { email: email },
      select: { password: true, id: true },
    });
    if (!existedEmail) {
      throw new AuthExceptions.EmailNotFoundException();
    }
    const isPwdMatched = await comparePwd(password, existedEmail.password);
    if (!isPwdMatched) {
      throw new AuthExceptions.PasswordNotMatchException();
    }
    const secureToken = signToken<LoginSignedToken>({
      userId: existedEmail.id,
    });
    return secureToken;
  },
  register: async (email: string, password: string, username?: string) => {
    const existedEmail = await prisma.user.findFirst({
      where: { email: email },
      select: { id: true },
    });
    if (existedEmail) {
      throw new AuthExceptions.DuplicateRegisterEmailException();
    }
    await prisma.user.create({
      data: {
        email,
        password: await hashPwd(password),
        name: !username ? null : username,
      },
    });
  },
  sendEmailVerify: async (userId: number) => {
    const existedUser = await prisma.user.findFirst({
      where: { id: userId },
      select: { email_verified_at: true, email: true },
    });

    if (!existedUser || existedUser.email_verified_at !== null) {
      throw new AuthExceptions.EmailAlreadyVerifiedException();
    }

    const data = await prisma.emailVerification.findFirst({
      where: { userId: userId },
      select: {
        expired_at: true,
        request_penalty: true,
        retries: true,
      },
    });

    if (!data) {
      const token = generateToken();
      const expiredAt = addTime(
        +process.env.EMAIL_VERIFY_EXPIRED_HOUR!,
        "hours"
      );
      await prisma.emailVerification.create({
        data: {
          userId,
          token,
          expired_at: expiredAt.toDate(),
          retries: 0,
        },
      });
      return { token, clientEmail: existedUser.email };
    } else {
      const { request_penalty, retries } = data;
      if (request_penalty && dayjs().isBefore(request_penalty)) {
        throw new AuthExceptions.EmailVerificationRequestMaxException();
      }
      if (retries === +process.env.MAX_VERIFY_EMAIL_RETRIES!) {
        await prisma.emailVerification.update({
          where: { userId: userId },
          data: {
            request_penalty: addTime(
              +process.env.MAX_VERIFY_EMAIL_PENALTY_HOUR!,
              "hours"
            ).toDate(),
            retries: 0,
          },
        });
        throw new AuthExceptions.EmailVerificationRequestMaxException();
      } else {
        const token = generateToken();
        const expiredAt = addTime(
          +process.env.EMAIL_VERIFY_EXPIRED_HOUR!,
          "hours"
        );
        await prisma.emailVerification.update({
          where: { userId: userId },
          data: {
            retries: { increment: 1 },
            expired_at: expiredAt.toDate(),
            token,
          },
        });
        return { token, clientEmail: existedUser.email };
      }
    }
  },
  verifyEmail: async (token: string) => {
    const data = await prisma.emailVerification.findFirst({
      where: { token: token },
      select: { id: true, expired_at: true, userId: true },
    });

    if (!data) {
      throw new AuthExceptions.EmailVerificationNotFoundException();
    }

    const { id, expired_at, userId } = data;

    if (dayjs().isAfter(expired_at)) {
      throw new AuthExceptions.EmailVerificationExpiredException();
    }
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { email_verified_at: dayjs().toDate() },
      }),
      prisma.emailVerification.delete({ where: { id: id } }),
    ]);
  },
};

export default service;
