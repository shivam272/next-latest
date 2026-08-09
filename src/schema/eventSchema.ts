import { z } from "zod";

export const eventSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Event Name must be at least 3 characters long"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description must be at most 500 characters long"),
  date: z.string().refine(
    (val) => {
      const dateObj = new Date(val);
      if (isNaN(dateObj.getTime())) {
        return false;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return dateObj > today;
    },
    {
      message: "Invalid date format or date cannot be in the past",
    },
  ),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format (HH:mm)",
  }),
  // venueId: z.string().trim().min(1, "Venue ID is required"),
  organizer: z
    .string()
    .trim()
    .min(1, "Organizer must be at least 1 character long"),
  artist: z.string().trim().min(3, "Artist must be at least 3 characters long"),
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
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: "Price must be a positive number",
      },
    ),
  ageRestriction: z
    .string()
    .trim()
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && Number.isInteger(num) && num > 0;
      },
      {
        message: "Age restriction must be a positive number",
      },
    ),
  duration: z.string().trim().min(1, "Duration is required"),
  addOns: z.array(
    z.object({
      name: z.string().trim().min(1, "Add-on name is required"),
    }),
  ),
});
