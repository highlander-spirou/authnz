import prisma from "../../lib/prisma";
import { putEmailProps } from "./dto/putEmail.DTO";
import { putInfoProps } from "./dto/putInfoDTO";
import * as UserException from "./user.exceptions";

const service = {
  getInfo: async (id: number) => {
    const user = await prisma.user.findFirst({
      where: { id: id },
      select: { email_verified_at: true, name: true, email: true },
    });
    if (!user) {
      throw new UserException.UserNotFoundException();
    }
    return {
      ...user,
      name: !user.name ? "Anonymous" : user.name,
    };
  },
  changeProfile: async (userId: number, payload: putInfoProps) => {
    await prisma.user.update({ where: { id: userId }, data: payload });
  },
  changeEmail: async (userId: number, payload: putEmailProps) => {
    const existedUser = await prisma.user.findFirst({
      where: { id: userId },
      select: { email_verified_at: true },
    });
    if (!existedUser) {
      throw new UserException.UserNotFoundException();
    }
    if (!existedUser.email_verified_at) {
      throw new UserException.UserEmailNotVerifiedException();
    }
    await prisma.user.update({ where: { id: userId }, data: payload });
  },
};

export default service;
