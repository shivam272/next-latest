import { IEventInputSchema } from "@/types";
import { connectToDatabase } from "@/lib/mongoose";
import Event from "@/models/event";

export const createEvent = async (data: IEventInputSchema) => {
  await connectToDatabase();
  return Event.create(data);
};
