import {
  IEventInputSchema,
  IEventRecords,
  IEventPaginationResponse,
} from "@/types";
import { connectToDatabase } from "@/lib/mongoose";
import Event from "@/models/event";

export const createEvent = async (data: IEventInputSchema) => {
  await connectToDatabase();
  return Event.create(data);
};

// Heavy methond, as it calls the entire collection. Use with caution.

export const getAllEvents = async (): Promise<IEventRecords[]> => {
  await connectToDatabase();
  const events = await Event.find({})
    .populate("venueId", "name city")
    .lean()
    .exec();

  return events.map((event) => ({
    name: event.name,
    description: event.description,
    date: event.date,
    time: event.time,
    organizer: event.organizer,
    artist: event.artist,
    capacity: event.capacity,
    price: event.price,
    ageRestriction: event.ageRestriction,
    duration: event.duration,
    addOns: event.addOns,
    venueName: event.venueId.name,
    venueCity: event.venueId.city,
    id: event._id.toString(),
  }));
};

export const getEventsByPagination = async (
  page = 1,
  limit = 8,
): Promise<IEventPaginationResponse> => {
  await connectToDatabase();

  const skip = (page - 1) * limit;
  const events = await Event.find({})
    .populate("venueId", "name city")
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit + 1)
    .lean()
    .exec();

  const hasNextPage = events.length > limit;

  const data = [...events].slice(0, limit).map((event) => ({
    name: event.name,
    description: event.description,
    date: event.date,
    time: event.time,
    organizer: event.organizer,
    artist: event.artist,
    capacity: event.capacity,
    price: event.price,
    ageRestriction: event.ageRestriction,
    duration: event.duration,
    addOns: event.addOns,
    venueName: event.venueId.name,
    venueCity: event.venueId.city,
    id: event._id.toString(),
  }));

  return {
    events: [...data],
    page,
    limit,
    hasNextPage,
    hasPreviousPage: page > 1,
  };
};
