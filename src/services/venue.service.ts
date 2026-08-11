import { IVenueInput, IVenueRecords, IVenuePaginationResponse } from "@/types";
import { connectToDatabase } from "@/lib/mongoose";
import Venue from "@/models/venue";

export const createVenue = async (data: IVenueInput) => {
  await connectToDatabase();
  return Venue.create(data);
};

// Heavy methond, as it calls the entire collection. Use with caution.

export const getAllVenues = async (): Promise<IVenueRecords[]> => {
  await connectToDatabase();
  const venues = await Venue.find({}).lean().exec();
  return venues.map((venue) => ({
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

export const getVenuesByPagination = async (
  page = 1,
  limit = 10,
): Promise<IVenuePaginationResponse> => {
  await connectToDatabase();

  const skip = (page - 1) * limit;
  const venues = await Venue.find({})
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit + 1)
    .lean()
    .exec();

  const hasNextPage = venues.length > limit;

  const data = venues.slice(0, limit).map((venue) => ({
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

  return {
    venues: data,
    page,
    limit,
    hasNextPage,
    hasPreviousPage: page > 1,
  };
};
