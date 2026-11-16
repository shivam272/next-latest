import { z } from "zod";
import {
  ACCEPTED_FILE_TYPES,
  BLOB_DOCUMENTS_FOLDER,
  BLOB_HOST_SUFFIX,
  DOCUMENT_FIELD_LABELS,
  DOCUMENT_FILE_RULES,
  DOCUMENT_LIMITS,
  DOCUMENT_VALIDATION_MESSAGES,
  FILE_SIGNATURES,
  MONGO_ID_REGEX,
} from "@/constants";
import { EDocumentField } from "@/types";

const fileRuleMessage = (field: EDocumentField): string =>
  `${DOCUMENT_FIELD_LABELS[field]} must be ${DOCUMENT_FILE_RULES[field]} of up to 1 MB`;

const isAcceptedFile = (field: EDocumentField, file: File): boolean =>
  file.size > 0 &&
  file.size <= DOCUMENT_LIMITS.maxFileBytes &&
  ACCEPTED_FILE_TYPES[field].includes(file.type);

const nameSchema = z
  .string()
  .trim()
  .min(DOCUMENT_LIMITS.nameMinLength, DOCUMENT_VALIDATION_MESSAGES.nameTooShort)
  .max(DOCUMENT_LIMITS.nameMaxLength, DOCUMENT_VALIDATION_MESSAGES.nameTooLong);

const fileListSchema = z
  .custom<FileList>(
    (value) => typeof FileList !== "undefined" && value instanceof FileList,
    { message: DOCUMENT_VALIDATION_MESSAGES.invalidFileInput },
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
    .superRefine(
      ({ image, adhaar, qualification, keptQualification }, context) => {
        const addIssue = (field: EDocumentField, message: string) =>
          context.addIssue({ code: "custom", path: [field], message });

        const singleFiles = [
          { field: EDocumentField.IMAGE, files: image },
          { field: EDocumentField.ADHAAR, files: adhaar },
        ];
        for (const { field, files } of singleFiles) {
          if (!files?.length) {
            if (!isEdit) {
              addIssue(field, `${DOCUMENT_FIELD_LABELS[field]} is required`);
            }
          } else if (files.length > 1 || !isAcceptedFile(field, files[0])) {
            addIssue(field, fileRuleMessage(field));
          }
        }

        const newFiles = Array.from(qualification ?? []);
        const total = keptQualification.length + newFiles.length;
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
            DOCUMENT_VALIDATION_MESSAGES.qualificationRequired,
          );
        } else if (total > DOCUMENT_LIMITS.maxQualificationFiles) {
          addIssue(
            EDocumentField.QUALIFICATION,
            DOCUMENT_VALIDATION_MESSAGES.tooManyQualifications,
          );
        }
      },
    );

const hasFileSignature = async (file: File): Promise<boolean> => {
  const signature = FILE_SIGNATURES[file.type];
  if (!signature) {
    return false;
  }
  // `slice` is a method of File, so it is called on the file, not destructured.
  const head = new Uint8Array(
    await file.slice(0, signature.length).arrayBuffer(),
  );
  return signature.every((byte, index) => head[index] === byte);
};

/** Server-side rules for one file on its way to Vercel Blob. */
export const documentFileServerSchema = z
  .object({
    field: z.enum(EDocumentField),
    file: z.instanceof(File, {
      message: DOCUMENT_VALIDATION_MESSAGES.fileRequired,
    }),
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
  .refine(isDocumentBlobUrl, DOCUMENT_VALIDATION_MESSAGES.notInBlob);

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
    .min(1, DOCUMENT_VALIDATION_MESSAGES.qualificationRequired)
    .max(
      DOCUMENT_LIMITS.maxQualificationFiles,
      DOCUMENT_VALIDATION_MESSAGES.tooManyQualifications,
    ),
});

export const documentProfileIdSchema = z
  .string()
  .regex(MONGO_ID_REGEX, DOCUMENT_VALIDATION_MESSAGES.invalidId);
