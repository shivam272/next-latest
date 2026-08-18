import mongoose, { Schema } from "mongoose";
import { EGenderEnum } from "@/types";

const profileSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    barId: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: Object.values(EGenderEnum),
      required: true,
    },
    age: {
      type: String,
      required: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: true,
      trim: true,
    },
  },

  {
    timestamps: true,
  },
);

export const ProfileModel =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);
