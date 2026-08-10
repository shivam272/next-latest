import { IVenueInput } from "@/types";
import { connectToDatabase } from "@/lib/mongoose";
import Venue from "@/models/venue";

export const createVenue = async (data: IVenueInput) => {
  await connectToDatabase();
  return Venue.create(data);
};

export const getAllVenues = async (): Promise<
  (IVenueInput & { id: string })[]
> => {
  await connectToDatabase();
  const venues = await Venue.find({}).lean().exec();
  return venues.map((venue: any) => ({
    name: venue.name,
    country: venue.country,
    address: venue.address,
    amenities: venue.amenities,
    city: venue.city,
    state: venue.state,
    zipCode: venue.zipCode,
    capacity: venue.capacity,
    id: venue._id.toString(),
  }));
};
