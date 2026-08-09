import { IVenueInput } from "@/types";
import { connectToDatabase } from "@/lib/mongoose";
import Venue from "@/models/venue";

export const createVenue = async (data: IVenueInput) => {
  await connectToDatabase();
  return Venue.create(data);
};

export const getAllVenues = async () => {
  await connectToDatabase();
  return Venue.find({}).lean().exec();
};
