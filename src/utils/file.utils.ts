const KILOBYTE = 1024;
const MEGABYTE = KILOBYTE * 1024;

/** 1048576 → "1.0 MB", 20480 → "20 KB". */
export const formatFileSize = (bytes: number): string =>
  bytes >= MEGABYTE
    ? `${(bytes / MEGABYTE).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / KILOBYTE))} KB`;

/** The original file name from a Vercel Blob URL, without the random suffix. */
export const getFileNameFromPath = (path: string): string => {
  const lastSegment = decodeURIComponent(
    new URL(path).pathname.split("/").pop() ?? "",
  );
  return lastSegment.replace(/-[A-Za-z0-9]{20,}(?=\.[^.]+$)/, "");
};
