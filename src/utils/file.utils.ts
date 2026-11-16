import {
  BLOB_RANDOM_SUFFIX_REGEX,
  BYTES_PER_KILOBYTE,
  BYTES_PER_MEGABYTE,
} from "@/constants";

/** 1048576 → "1.0 MB", 20480 → "20 KB". */
export const formatFileSize = (bytes: number): string =>
  bytes >= BYTES_PER_MEGABYTE
    ? `${(bytes / BYTES_PER_MEGABYTE).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / BYTES_PER_KILOBYTE))} KB`;

/** The original file name from a Vercel Blob URL, without the random suffix. */
export const getFileNameFromPath = (path: string): string => {
  const { pathname } = new URL(path);
  const lastSegment = decodeURIComponent(pathname.split("/").pop() ?? "");
  return lastSegment.replace(BLOB_RANDOM_SUFFIX_REGEX, "");
};
