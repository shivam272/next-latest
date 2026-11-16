import { del, put } from "@vercel/blob";
import {
  BLOB_DOCUMENTS_FOLDER,
  UNSAFE_FILE_NAME_CHARACTERS_REGEX,
} from "@/constants";
import { type EDocumentField, type IStoredFile } from "@/types";

/** Keeps letters, digits, dot, dash and underscore, so the URL stays readable. */
const toSafeFileName = (fileName: string): string =>
  fileName.replace(UNSAFE_FILE_NAME_CHARACTERS_REGEX, "-").toLowerCase();

/**
 * Stores one file in Vercel Blob. A random suffix keeps two files with the
 * same name apart, so nothing is ever overwritten.
 */
export const uploadToBlob = async (
  field: EDocumentField,
  file: File,
): Promise<IStoredFile> => {
  const { name, type, size } = file;
  const { url } = await put(
    `${BLOB_DOCUMENTS_FOLDER}/${field}/${toSafeFileName(name)}`,
    file,
    {
      access: "public",
      addRandomSuffix: true,
      contentType: type,
    },
  );
  return { path: url, size };
};

/**
 * Deletes files from Vercel Blob without failing the caller. It runs after
 * the database is already correct, so a leftover file is logged, not raised.
 */
export const deleteFromBlobQuietly = async (paths: string[]): Promise<void> => {
  if (paths.length === 0) {
    return;
  }
  try {
    await del(paths);
  } catch (error) {
    console.error("Failed to delete files from Vercel Blob", paths, error);
  }
};
