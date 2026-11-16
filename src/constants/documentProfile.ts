import { EDocumentField } from "@/types";
import { BYTES_PER_MEGABYTE } from "./fileSize";

/** Routes of the document upload pages. */
export const DOCUMENT_PATHS = {
  list: "/dashboard/documents",
  create: "/dashboard/documents/new",
  edit: (id: string) => `/dashboard/documents/${id}/edit`,
} as const;

export const DOCUMENT_LIMITS = {
  maxFileBytes: BYTES_PER_MEGABYTE,
  maxQualificationFiles: 4,
  nameMinLength: 2,
  nameMaxLength: 100,
} as const;

/** The most files one form uploads: the image, the Aadhaar and the qualifications. */
export const MAX_FILES_PER_FORM = 2 + DOCUMENT_LIMITS.maxQualificationFiles;

/** FormData keys of a single-file upload, shared by the form and the server action. */
export const DOCUMENT_UPLOAD_FORM_KEYS = {
  field: "field",
  file: "file",
} as const;

/** The Vercel Blob folder these files live in; nothing outside it is accepted or deleted. */
export const BLOB_DOCUMENTS_FOLDER = "documents";
export const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/** What each field accepts. The image is a picture only (JPEG/JPG). */
export const ACCEPTED_FILE_TYPES: Record<EDocumentField, readonly string[]> = {
  [EDocumentField.IMAGE]: ["image/jpeg"],
  [EDocumentField.ADHAAR]: ["application/pdf"],
  [EDocumentField.QUALIFICATION]: ["application/pdf"],
};

/** The `accept` attribute of each file input. */
export const FILE_INPUT_ACCEPT: Record<EDocumentField, string> = {
  [EDocumentField.IMAGE]: ".jpg,.jpeg,image/jpeg",
  [EDocumentField.ADHAAR]: ".pdf,application/pdf",
  [EDocumentField.QUALIFICATION]: ".pdf,application/pdf",
};

/** First bytes of each accepted format, so the server checks content, not the claimed type. */
export const FILE_SIGNATURES: Record<string, readonly number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "application/pdf": [0x25, 0x50, 0x44, 0x46], // "%PDF"
};

export const DOCUMENT_FIELD_LABELS: Record<EDocumentField, string> = {
  [EDocumentField.IMAGE]: "Image",
  [EDocumentField.ADHAAR]: "Aadhaar",
  [EDocumentField.QUALIFICATION]: "Qualification",
};

export const DOCUMENT_FILE_RULES: Record<EDocumentField, string> = {
  [EDocumentField.IMAGE]: "a JPEG or JPG image",
  [EDocumentField.ADHAAR]: "a PDF",
  [EDocumentField.QUALIFICATION]: "PDF files",
};

export const DOCUMENT_VALIDATION_MESSAGES = {
  nameTooShort: `Name must be at least ${DOCUMENT_LIMITS.nameMinLength} characters`,
  nameTooLong: `Name must be at most ${DOCUMENT_LIMITS.nameMaxLength} characters`,
  qualificationRequired: "Add at least one qualification PDF",
  tooManyQualifications: `Up to ${DOCUMENT_LIMITS.maxQualificationFiles} qualification PDFs in total`,
  invalidFileInput: "Invalid file input",
  fileRequired: "Choose a file to upload",
  notInBlob: "File must be stored in Vercel Blob",
  invalidId: "Invalid document profile id",
} as const;

export const DOCUMENT_ACTION_MESSAGES = {
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
