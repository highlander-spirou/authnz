import prisma from "../../lib/prisma";
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
};

export default service;
