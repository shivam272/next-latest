import { Schema, models, model } from "mongoose";
import { type IVenueInput } from "@/types/index";

const venue = new Schema<IVenueInput>(
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
    amenities: [
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

export default models.Venue || model<IVenueInput>("Venue", venue);
