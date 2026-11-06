import { Schema, model, models, type Model } from "mongoose";

export interface UploadedFile {
  url: string;
  pathname: string;
  filename: string;
  contentType: string;
  size: number;
}

export interface UploadSubmission {
  title: string;
  files: UploadedFile[];
}

const fileSchema = new Schema<UploadedFile>(
  {
    url: { type: String, required: true },
    pathname: { type: String, required: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false },
);

const uploadSchema = new Schema<UploadSubmission>(
  {
    title: { type: String, required: true, trim: true },
    files: [fileSchema],
  },
  { timestamps: true },
);

export default (models.Upload as Model<UploadSubmission>) ||
  model<UploadSubmission>("Upload", uploadSchema);
