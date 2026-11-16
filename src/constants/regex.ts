export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;
export const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;

/** The random suffix Vercel Blob adds before a file's extension ("-x1Y2…"). */
export const BLOB_RANDOM_SUFFIX_REGEX = /-[A-Za-z0-9]{20,}(?=\.[^.]+$)/;

/** Anything other than letters, digits, ".", "_" and "-" in a file name. */
export const UNSAFE_FILE_NAME_CHARACTERS_REGEX = /[^\w.-]+/g;
