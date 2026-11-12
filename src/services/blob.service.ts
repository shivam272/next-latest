import { put, del, get } from "@vercel/blob";

interface IStoredFile {
  path: string;
  publicUrl: string;
  size: number;
  name: string;
}

export const uploadToBlob = async (
  file: File,
  folder = "documents"
): Promise<IStoredFile> => {
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `${folder}/${Date.now()}-${cleanName}`;
  const blob = await put(pathname, file, { access: "private" });
  return {
    path: blob.url,
    publicUrl: `/api/files/view?path=${encodeURIComponent(blob.url)}`,
    size: file.size,
    name: file.name,
  };
};

// Batch upload for multiple qualification files
export const uploadMultipleToBlob = async (
  files: File[],
  folder = "qualifications"
): Promise<IStoredFile[]> => {
  if (!files || files.length === 0) return [];
  return Promise.all(files.map((file) => uploadToBlob(file, folder)));
};

// Single delete
export const deleteFromBlob = async (path: string): Promise<void> => {
  if (!path) return;
  try {
    await del(path);
  } catch (error) {
    console.error("Error deleting from Vercel Blob:", error);
  }
};

// Batch delete in 1 single network request
export const deleteMultipleFromBlob = async (paths: string[]): Promise<void> => {
  const validPaths = paths.filter(Boolean);
  if (validPaths.length === 0) return;
  try {
    await del(validPaths);
  } catch (error) {
    console.error("Error batch deleting from Vercel Blob:", error);
  }
};

export const getPrivateBlob = async (path: string) => {
  return await get(path, { access: "private" });
};
