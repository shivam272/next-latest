import { Schema, models, model } from "mongoose";
import { type IEventInput } from "@/types/index";

const event = new Schema<IEventInput>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    // venueId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Venue",
    //   required: true,
    // },
    venueId: {
      type: String,
      ref: "Venue",
      required: true,
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
    ageRestriction: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    addOns: [
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

export default models.Event || model<IEventInput>("Event", event);
