import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  // gnerate a salt and hash the password using bcrypt
  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  // compare the provided password with the hashed password
  return bcrypt.compare(password, hashedPassword);
};
