import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const comparePasswords = async (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  return isMatch;
};
