import { del, put } from "@vercel/blob";
import { BLOB_DOCUMENTS_FOLDER } from "@/schema";
import { type EDocumentField, type IStoredFile } from "@/types";

const UNSAFE_FILE_NAME_CHARACTERS = /[^\w.-]+/g;

/** Keeps letters, digits, dot, dash and underscore, so the URL stays readable. */
const toSafeFileName = (fileName: string): string =>
  fileName.replace(UNSAFE_FILE_NAME_CHARACTERS, "-").toLowerCase();

/**
 * Stores one file in Vercel Blob. A random suffix keeps two files with the
 * same name apart, so nothing is ever overwritten.
 */
export const uploadToBlob = async (
  field: EDocumentField,
  file: File,
): Promise<IStoredFile> => {
  const blob = await put(
    `${BLOB_DOCUMENTS_FOLDER}/${field}/${toSafeFileName(file.name)}`,
    file,
    {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    },
  );
  return { path: blob.url, size: file.size };
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
