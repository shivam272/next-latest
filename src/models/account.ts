import { Schema, models, model } from "mongoose";
import { type IAccountInput } from "@/types/index";

const accountSchema = new Schema<IAccountInput>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Account || model<IAccountInput>("Account", accountSchema);
