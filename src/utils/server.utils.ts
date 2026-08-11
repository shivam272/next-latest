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

interface PaginationParams {
  page: number;
  limit: number;
}

export const validatePaginationParams = (
  page?: string | null,
  limit?: string | null,
  options?: {
    maxLimit?: number;
    defaultPage?: number;
    defaultLimit?: number;
  },
): PaginationParams => {
  const { maxLimit = 15, defaultPage = 1, defaultLimit = 10 } = options || {};

  // Validate page
  const pageNum = Number(page ?? defaultPage);
  const validPage =
    Number.isInteger(pageNum) && pageNum > 0 ? pageNum : defaultPage;

  // Validate limit
  const limitNum = Number(limit ?? defaultLimit);
  const validLimit =
    Number.isInteger(limitNum) && limitNum > 0 && limitNum <= maxLimit
      ? limitNum
      : defaultLimit;

  return { page: validPage, limit: validLimit };
};
