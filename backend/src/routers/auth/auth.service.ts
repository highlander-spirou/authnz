import { signToken } from "../../lib/hashes/jwt-token";
import { comparePwd, hashPwd } from "../../lib/hashes/pwd-hash";
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
      data: { email, password: await hashPwd(password), name: username },
    });
  },
};

export default service;
