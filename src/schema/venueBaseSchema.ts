import { z } from "zod";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ["application/pdf"];

const adhaarCardSchema = z
  .custom<FileList>(
    (v) => typeof FileList !== "undefined" && v instanceof FileList,
    { message: "Invalid file input" },
  )
  .optional()
  .refine(
    (fileList) => {
      if (!fileList || fileList.length === 0) return true;
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (
          file.size > MAX_FILE_SIZE ||
          !ACCEPTED_IMAGE_TYPES.includes(file.type)
        ) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Invalid file. Check the file sizes and format.",
    },
  );

const venueSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Venue Name must be at least 3 characters long"),
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters long")
    .max(100, "Address must be at most 100 characters long"),
  city: z.string().trim().min(2, "City must be at least 2 characters long"),
  state: z.string().trim().min(2, "State must be at least 2 characters long"),
  zipCode: z
    .string()
    .trim()
    .min(5, "Zip code should be at least 5 characters long")
    .regex(/^[0-9]{5,6}$/, "Enter a valid ZIP code"),
  country: z.string().trim().min(3, "Country is required"),
  capacity: z
    .string()
    .trim()
    .min(1, "Capacity is required")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && Number.isInteger(num) && num > 0;
      },
      {
        message: "Capacity must be a positive integer",
      },
    ),
  amenities: z.array(
    z.object({
      name: z.string().trim().min(1, "Amenity name is required"),
    }),
  ),
});

export const venueServerSchema = venueSchema.extend({
  adhaarCard: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return files.every(
          (file) =>
            file.size <= MAX_FILE_SIZE &&
            ACCEPTED_IMAGE_TYPES.includes(file.type),
        );
      },
      {
        message: "Each file must not exceed 1 MB and be a valid PDF.",
      },
    ),
});

export const venueClientSchema = venueSchema.extend({
  adhaarCard: adhaarCardSchema,
});
