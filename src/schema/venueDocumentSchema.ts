import { z } from "zod";

const MAX_SIZE = 1_000_000;
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "application/pdf"];
const PDF_TYPES = ["application/pdf"];

const clientFile = (types: string[], maxCount = 1) =>
  z.custom<FileList>()
    .refine((f) => f && f.length > 0 && f.length <= maxCount, `Select 1 to ${maxCount} file(s)`)
    .refine(
      (f) => Array.from(f).every((file) => file.size <= MAX_SIZE && types.includes(file.type)),
      "Invalid format or size exceeds 1MB"
    );

const serverFile = (types: string[]) =>
  z.instanceof(File).refine((f) => f.size <= MAX_SIZE && types.includes(f.type));

export const venueDocumentClientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  image: clientFile(IMAGE_TYPES),
  adhaar: clientFile(PDF_TYPES),
  qualification: clientFile(PDF_TYPES, 10),
});

export const venueDocumentServerSchema = z.object({
  name: z.string().trim().min(2),
  image: serverFile(IMAGE_TYPES),
  adhaar: serverFile(PDF_TYPES),
  qualification: z.array(serverFile(PDF_TYPES)).min(1),
});

export type IVenueDocumentClientInput = z.infer<typeof venueDocumentClientSchema>;
