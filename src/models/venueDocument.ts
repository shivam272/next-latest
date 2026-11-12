import { Schema, models, model } from "mongoose";

const fileSchema = {
  path: { type: String, required: true },
  size: { type: Number, required: true },
};

const VenueDocumentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: fileSchema,
    adhaar: fileSchema,
    qualification: [fileSchema],
  },
  { timestamps: true }
);

export const VenueDocument =
  models.VenueDocument || model("VenueDocument", VenueDocumentSchema);
