import { Schema, models, model } from "mongoose";

const StoredFileSchema = new Schema(
  {
    path: { type: String, required: true },
    publicUrl: { type: String, required: true },
    size: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const DocumentProfileSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: StoredFileSchema, required: true },
    adhaar: { type: StoredFileSchema, required: true },
    qualification: [{ type: StoredFileSchema, required: true }],
  },
  { timestamps: true }
);

export const DocumentProfile =
  models.DocumentProfile || model("DocumentProfile", DocumentProfileSchema);
