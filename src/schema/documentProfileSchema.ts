import { z } from "zod";
import { MONGO_ID_REGEX } from "@/constants";
import { EDocumentField } from "@/types";

export const DOCUMENT_LIMITS = {
  maxFileBytes: 1024 * 1024,
  maxQualificationFiles: 4,
  nameMinLength: 2,
  nameMaxLength: 100,
} as const;

/** The Vercel Blob folder these files live in; nothing outside it is accepted or deleted. */
export const BLOB_DOCUMENTS_FOLDER = "documents";
const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/** What each field accepts. The image is a picture only (JPEG/JPG). */
const ACCEPTED_FILE_TYPES: Record<EDocumentField, readonly string[]> = {
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
const FILE_SIGNATURES: Record<string, readonly number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "application/pdf": [0x25, 0x50, 0x44, 0x46], // "%PDF"
};

const FIELD_LABELS: Record<EDocumentField, string> = {
  [EDocumentField.IMAGE]: "Image",
  [EDocumentField.ADHAAR]: "Aadhaar",
  [EDocumentField.QUALIFICATION]: "Qualification",
};

const FILE_RULES: Record<EDocumentField, string> = {
  [EDocumentField.IMAGE]: "a JPEG or JPG image",
  [EDocumentField.ADHAAR]: "a PDF",
  [EDocumentField.QUALIFICATION]: "PDF files",
};

const QUALIFICATION_COUNT_MESSAGES = {
  min: "Add at least one qualification PDF",
  max: `Up to ${DOCUMENT_LIMITS.maxQualificationFiles} qualification PDFs in total`,
} as const;

const fileRuleMessage = (field: EDocumentField): string =>
  `${FIELD_LABELS[field]} must be ${FILE_RULES[field]} of up to 1 MB`;

const isAcceptedFile = (field: EDocumentField, file: File): boolean =>
  file.size > 0 &&
  file.size <= DOCUMENT_LIMITS.maxFileBytes &&
  ACCEPTED_FILE_TYPES[field].includes(file.type);

const nameSchema = z
  .string()
  .trim()
  .min(
    DOCUMENT_LIMITS.nameMinLength,
    `Name must be at least ${DOCUMENT_LIMITS.nameMinLength} characters`,
  )
  .max(
    DOCUMENT_LIMITS.nameMaxLength,
    `Name must be at most ${DOCUMENT_LIMITS.nameMaxLength} characters`,
  );

const fileListSchema = z
  .custom<FileList>(
    (value) => typeof FileList !== "undefined" && value instanceof FileList,
    { message: "Invalid file input" },
  )
  .optional();

/**
 * Browser-side rules. On create every file is required; on edit an empty file
 * input keeps the stored file, so only newly chosen files are checked.
 */
export const documentProfileClientSchema = (isEdit: boolean) =>
  z
    .object({
      name: nameSchema,
      image: fileListSchema,
      adhaar: fileListSchema,
      qualification: fileListSchema,
      keptQualification: z.array(
        z.object({ path: z.string(), size: z.number() }),
      ),
    })
    .superRefine((values, context) => {
      const addIssue = (field: EDocumentField, message: string) =>
        context.addIssue({ code: "custom", path: [field], message });

      for (const field of [EDocumentField.IMAGE, EDocumentField.ADHAAR]) {
        const files = values[field];
        if (!files?.length) {
          if (!isEdit) {
            addIssue(field, `${FIELD_LABELS[field]} is required`);
          }
        } else if (files.length > 1 || !isAcceptedFile(field, files[0])) {
          addIssue(field, fileRuleMessage(field));
        }
      }

      const newFiles = Array.from(values.qualification ?? []);
      const total = values.keptQualification.length + newFiles.length;
      if (
        newFiles.some(
          (file) => !isAcceptedFile(EDocumentField.QUALIFICATION, file),
        )
      ) {
        addIssue(
          EDocumentField.QUALIFICATION,
          fileRuleMessage(EDocumentField.QUALIFICATION),
        );
      } else if (total < 1) {
        addIssue(
          EDocumentField.QUALIFICATION,
          QUALIFICATION_COUNT_MESSAGES.min,
        );
      } else if (total > DOCUMENT_LIMITS.maxQualificationFiles) {
        addIssue(
          EDocumentField.QUALIFICATION,
          QUALIFICATION_COUNT_MESSAGES.max,
        );
      }
    });

const hasFileSignature = async (file: File): Promise<boolean> => {
  const signature = FILE_SIGNATURES[file.type];
  if (!signature) {
    return false;
  }
  const head = new Uint8Array(
    await file.slice(0, signature.length).arrayBuffer(),
  );
  return signature.every((byte, index) => head[index] === byte);
};

/** Server-side rules for one file on its way to Vercel Blob. */
export const documentFileServerSchema = z
  .object({
    field: z.enum(EDocumentField),
    file: z.instanceof(File, { message: "Choose a file to upload" }),
  })
  .superRefine(async ({ field, file }, context) => {
    if (!isAcceptedFile(field, file) || !(await hasFileSignature(file))) {
      context.addIssue({
        code: "custom",
        path: ["file"],
        message: fileRuleMessage(field),
      });
    }
  });

const isDocumentBlobUrl = (value: string): boolean => {
  try {
    const { protocol, hostname, pathname } = new URL(value);
    return (
      protocol === "https:" &&
      hostname.endsWith(BLOB_HOST_SUFFIX) &&
      pathname.startsWith(`/${BLOB_DOCUMENTS_FOLDER}/`)
    );
  } catch {
    return false;
  }
};

/** A saved file reference must point into this feature's Blob folder. */
export const blobPathSchema = z
  .string()
  .refine(isDocumentBlobUrl, "File must be stored in Vercel Blob");

const storedFileServerSchema = z.object({
  path: blobPathSchema,
  size: z.number().int().positive().max(DOCUMENT_LIMITS.maxFileBytes),
});

/** Server-side rules for the whole form, after its files are uploaded. */
export const documentProfileServerSchema = z.object({
  name: nameSchema,
  image: storedFileServerSchema,
  adhaar: storedFileServerSchema,
  qualification: z
    .array(storedFileServerSchema)
    .min(1, QUALIFICATION_COUNT_MESSAGES.min)
    .max(
      DOCUMENT_LIMITS.maxQualificationFiles,
      QUALIFICATION_COUNT_MESSAGES.max,
    ),
});

export const documentProfileIdSchema = z
  .string()
  .regex(MONGO_ID_REGEX, "Invalid document profile id");
