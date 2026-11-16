import { Schema, models, model, type Model } from "mongoose";
import { type IDocumentProfileInput } from "@/types";

const storedFileSchema = new Schema(
  {
    path: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const documentProfileSchema = new Schema<IDocumentProfileInput>(
  {
    name: { type: String, required: true, trim: true },
    image: { type: storedFileSchema, required: true },
    adhaar: { type: storedFileSchema, required: true },
    qualification: { type: [storedFileSchema], required: true },
  },
  { timestamps: true },
);

// The list page shows the newest profiles first.
documentProfileSchema.index({ createdAt: -1 });

const DocumentProfile: Model<IDocumentProfileInput> =
  models.DocumentProfile ||
  model<IDocumentProfileInput>("DocumentProfile", documentProfileSchema);

export default DocumentProfile;
