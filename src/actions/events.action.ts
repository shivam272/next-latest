"use server";

import { IEventPaginationResponse, TApiResponse } from "@/types";
import { getEventsByPagination } from "@/services/event.service";

export const fetchEvents = async (
  page: number,
  limit: number,
): Promise<TApiResponse<IEventPaginationResponse>> => {
  try {
    const data = await getEventsByPagination(page, limit);
    return {
      data,
      status: 200,
      message: "Events fetched successfully",
    };
  } catch {
    return {
      data: {
        events: [],
        page,
        limit,
        hasNextPage: false,
        hasPreviousPage: page > 1,
      },
      status: 500,
      message: "An error occurred while fetching events",
    };
  }
};
