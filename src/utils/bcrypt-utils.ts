import * as bcrypt from 'bcrypt';

export const hashText = async (password: string) => {
  const hashedText = await bcrypt.hash(password, 10);
  return hashedText;
};

export const compareText = async (
  plainText: string,
  hashedText: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainText, hashedText);
  return isMatch;
};
