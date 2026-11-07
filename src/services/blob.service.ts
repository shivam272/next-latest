import { put, del, get } from "@vercel/blob";

export interface IStoredFile {
  path: string;
  size: number;
}

export async function uploadToBlob(
  file: File,
  folder: string = "documents"
): Promise<IStoredFile> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `${folder}/${Date.now()}-${cleanName}`;
  const blob = await put(pathname, file, { access: "private" });
  return {
    path: blob.url,
    size: file.size,
  };
}

export async function uploadMultipleToBlob(
  files: File[],
  folder: string = "qualifications"
): Promise<IStoredFile[]> {
  if (!files || files.length === 0) return [];
  return Promise.all(files.map((file) => uploadToBlob(file, folder)));
}

export async function deleteFromBlob(urlOrPathname: string): Promise<void> {
  if (!urlOrPathname) return;
  try {
    await del(urlOrPathname);
  } catch (error) {
    console.error("Error deleting from Vercel Blob:", error);
  }
}

export async function deleteMultipleFromBlob(urlsOrPathnames: string[]): Promise<void> {
  const validItems = urlsOrPathnames.filter(Boolean);
  if (validItems.length === 0) return;
  try {
    await del(validItems);
  } catch (error) {
    console.error("Error deleting multiple files from Vercel Blob:", error);
  }
}

export async function getPrivateBlob(pathnameOrUrl: string) {
  return await get(pathnameOrUrl, { access: "private" });
}

