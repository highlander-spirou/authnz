import { signToken } from "../../lib/hashes/jwt-token";
import { comparePwd } from "../../lib/hashes/pwd-hash";
import prisma from "../../lib/prisma";
import {
  EmailNotFoundException,
  PasswordNotMatchException,
} from "./auth.exceptions";
import { LoginSignedToken } from "./types";

const service = {
  login: async (email: string, password: string) => {
    const existedEmail = await prisma.user.findFirst({
      where: { email: email },
      select: { password: true, id: true },
    });
    if (!existedEmail) {
      throw new EmailNotFoundException();
    }
    const isPwdMatched = await comparePwd(password, existedEmail.password);
    if (!isPwdMatched) {
      throw new PasswordNotMatchException();
    }
    const secureToken = signToken<LoginSignedToken>({
      userId: existedEmail.id,
    });
    return secureToken;
  },
};

export default service;
