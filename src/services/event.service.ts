import { IEventInput } from "@/types";
import { connectToDatabase } from "@/lib/mongoose";
import Event from "@/models/event";

export const createEvent = async (data: Omit<IEventInput, "venueId">) => {
  await connectToDatabase();
  return Event.create(data);
};
