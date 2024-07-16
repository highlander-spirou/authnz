import prisma from "../../lib/prisma";
import { putInfoProps } from "./dto/putInfoDTO";
import { UserNotFoundException } from "./user.exceptions";

const service = {
  getInfo: async (id: number) => {
    const user = await prisma.user.findFirst({
      where: { id: id },
      select: { email_verified_at: true, name: true },
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return {
      name: !user.name ? "Anonymous" : user.name,
      email_verified_at: user.email_verified_at,
    };
  },
  changeProfile: async (userId: number, payload: putInfoProps) => {
    await prisma.user.update({ where: { id: userId }, data: payload });
  },
};

export default service;
