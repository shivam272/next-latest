"use server";

import Venue from "@/models/venue";
import { IVenuePaginationResponse, TApiResponse } from "@/types";

export const fetchVenues = async (
  page: number,
  limit: number,
): Promise<TApiResponse<IVenuePaginationResponse>> => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(
    `${baseUrl}/api/dashboard/create-venue?page=${page}&limit=${limit}`,
  );

  const { data, status, message } = await response.json();
  return { data, message, status };
};

export const validateVenueId = async (venueId: string): Promise<boolean> => {
  const venueIdRegex = /^[a-fA-F0-9]{24}$/;
  if (!venueIdRegex.test(venueId)) {
    return false;
  }
  const venue = await Venue.findById(venueId);
  return !!venue;
};
