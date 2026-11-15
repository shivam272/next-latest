"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DOCUMENT_PATHS } from "@/constants";
import {
  DOCUMENT_LIMITS,
  blobPathSchema,
  documentFileServerSchema,
  documentProfileIdSchema,
  documentProfileServerSchema,
} from "@/schema";
import {
  createDocumentProfile,
  deleteDocumentProfile,
  deleteUnusedFiles,
  updateDocumentProfile,
  uploadToBlob,
} from "@/services";
import {
  type IActionResult,
  type IDocumentProfile,
  type IDocumentProfileInput,
  type IStoredFile,
} from "@/types";

/** The most files one form can upload: image, Aadhaar and the qualifications. */
const MAX_FILES_PER_FORM = 2 + DOCUMENT_LIMITS.maxQualificationFiles;

const MESSAGES = {
  uploaded: "File uploaded",
  uploadFailed: "Could not upload the file. Please try again.",
  created: "Documents saved",
  updated: "Documents updated",
  deleted: "Documents deleted",
  notFound: "These documents no longer exist",
  invalid: "Please check the details and try again.",
  saveFailed: "Could not save the documents. Please try again.",
  deleteFailed: "Could not delete the documents. Please try again.",
} as const;

const firstIssue = (error: z.ZodError): string =>
  error.issues[0]?.message ?? MESSAGES.invalid;

/**
 * Step 1 of a submit: the server checks one file with Zod (type from its
 * content, size), stores it in Vercel Blob and returns its path and size.
 * One file per request keeps each request far below Vercel's 4.5 MB limit.
 */
export const uploadDocumentFileAction = async (
  formData: FormData,
): Promise<IActionResult<IStoredFile>> => {
  const result = await documentFileServerSchema.safeParseAsync({
    field: formData.get("field"),
    file: formData.get("file"),
  });
  if (!result.success) {
    return { success: false, message: firstIssue(result.error) };
  }

  try {
    const stored = await uploadToBlob(result.data.field, result.data.file);
    return { success: true, message: MESSAGES.uploaded, data: stored };
  } catch (error) {
    console.error("Vercel Blob upload failed", error);
    return { success: false, message: MESSAGES.uploadFailed };
  }
};

/** Step 2: the server checks the whole form with Zod and saves the paths. */
export const createDocumentProfileAction = async (
  input: IDocumentProfileInput,
): Promise<IActionResult<IDocumentProfile>> => {
  const result = documentProfileServerSchema.safeParse(input);
  if (!result.success) {
    return { success: false, message: firstIssue(result.error) };
  }

  try {
    const profile = await createDocumentProfile(result.data);
    revalidatePath(DOCUMENT_PATHS.list);
    return { success: true, message: MESSAGES.created, data: profile };
  } catch (error) {
    console.error("Saving document profile failed", error);
    return { success: false, message: MESSAGES.saveFailed };
  }
};

/** PATCH: replaces the profile's fields and deletes the files it dropped. */
export const updateDocumentProfileAction = async (
  id: string,
  input: IDocumentProfileInput,
): Promise<IActionResult<IDocumentProfile>> => {
  const idResult = documentProfileIdSchema.safeParse(id);
  const result = documentProfileServerSchema.safeParse(input);
  if (!idResult.success) {
    return { success: false, message: firstIssue(idResult.error) };
  }
  if (!result.success) {
    return { success: false, message: firstIssue(result.error) };
  }

  try {
    const profile = await updateDocumentProfile(idResult.data, result.data);
    if (!profile) {
      return { success: false, message: MESSAGES.notFound };
    }
    revalidatePath(DOCUMENT_PATHS.list);
    return { success: true, message: MESSAGES.updated, data: profile };
  } catch (error) {
    console.error("Updating document profile failed", error);
    return { success: false, message: MESSAGES.saveFailed };
  }
};

export const deleteDocumentProfileAction = async (
  id: string,
): Promise<IActionResult> => {
  const idResult = documentProfileIdSchema.safeParse(id);
  if (!idResult.success) {
    return { success: false, message: firstIssue(idResult.error) };
  }

  try {
    const deleted = await deleteDocumentProfile(idResult.data);
    if (!deleted) {
      return { success: false, message: MESSAGES.notFound };
    }
    revalidatePath(DOCUMENT_PATHS.list);
    return { success: true, message: MESSAGES.deleted };
  } catch (error) {
    console.error("Deleting document profile failed", error);
    return { success: false, message: MESSAGES.deleteFailed };
  }
};

/**
 * Clean-up when a submit fails part-way: deletes the files that request
 * uploaded. Files that a saved profile uses are never deleted.
 */
export const discardUploadedFilesAction = async (
  paths: string[],
): Promise<void> => {
  const result = z
    .array(blobPathSchema)
    .max(MAX_FILES_PER_FORM)
    .safeParse(paths);
  if (result.success) {
    await deleteUnusedFiles(result.data);
  }
};
