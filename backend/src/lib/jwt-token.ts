import jwt from "jsonwebtoken";

interface TokenInterface {
  userId: number;
  role: string;
}

export const signToken = (payload: any) => {
  const ttl = +process.env.DEFAULT_TTL! as number;
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: `${ttl}h`,
  });
  return token;
};

export const verifyToken = (tokenRaw: string) => {
  const token = tokenRaw.split("Bearer ")[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as TokenInterface;
    return payload;
  } catch (error) {
    return null;
  }
};
