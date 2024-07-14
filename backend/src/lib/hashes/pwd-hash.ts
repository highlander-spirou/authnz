import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPwd = async (pwd: string) => {
  const hash = await bcrypt.hash(pwd, saltRounds);
  return hash;
};

export const comparePwd = async (plainPwd: string, storedPwd: string) => {
  const result = await bcrypt.compare(plainPwd, storedPwd);
  return result;
};