import { Schema, models, model, InferSchemaType } from "mongoose";
import { type IFormInput, EGenderEnum } from "@/types";

const UserSchema = new Schema<IFormInput>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: Object.values(EGenderEnum),
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    terms: {
      type: Boolean,
      required: true,
      default: false,
    },
    phone: [
      {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: (phones: string[]) => phones.length,
          message: "At least one phone number is required",
        },
      },
    ],
    cities: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// to check if the model is already compiled, if not compile it
export default models.User || model<IFormInput>("User", UserSchema);
