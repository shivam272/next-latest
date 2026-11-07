import { Schema, models, model } from "mongoose";
import { type IVenueServerInput } from "@/types/index";

const venue = new Schema<IVenueServerInput>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: String,
      required: true,
      trim: true,
    },
    adhaarCard: [
      {
        url: {
          type: String,
          required: false,
          trim: true,
        },
        size: {
          type: Number,
          required: false,
        },
        filename: {
          type: String,
          required: false,
          trim: true,
        },
        mimeType: {
          type: String,
          required: false,
          trim: true,
        },
        uploadedAt: {
          type: Date,
          required: false,
          default: null,
        },
      },
    ],
    amenities: [
      {
        _id: false,
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

export default models.Venue || model<IVenueServerInput>("Venue", venue);
