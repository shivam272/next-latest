import { z } from "zod";
import { EMAIL_REGEX, MONGO_ID_REGEX } from "@/constants";
import { EGenderEnum } from "@/types";

const baseSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .regex(EMAIL_REGEX, "Invalid email address"),
  barId: z.string().trim().min(2, "Bar ID must be at least 2 characters long"),
});

export const signupSchema = baseSchema
  .extend({
    password: z
      .string()
      .trim()
      .min(4, "Password must be at least 4 characters long"),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileSchema = baseSchema.extend({
  userId: z
    .string()
    .trim()
    .min(1, "User ID is required")
    .regex(MONGO_ID_REGEX, "User ID must be a valid MongoDB ID"),
  gender: z.enum(EGenderEnum),
  age: z
    .string()
    .trim()
    .min(1, "Age is required")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && Number.isInteger(num) && num > 18;
      },
      {
        message: "Age must be greater than 18",
      },
    ),
  telephone: z.string().trim().min(1, "Telephone is required"),
});
