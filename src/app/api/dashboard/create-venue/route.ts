import { createVenue, getVenuesByPagination } from "@/services";
import { venueSchema } from "@/schema/venueSchema";
import { IVenuePaginationResponse } from "@/types";
import { NextResponse, NextRequest } from "next/server";
import { validatePaginationParams } from "@/utils/server.utils";

interface IBaseResponse {
  data: IVenuePaginationResponse | null;
  status: number;
  message: string;
}

const errorResponse: Record<string, IBaseResponse> = {
  registeredSuccessfully: {
    data: null,
    message: "Venue saved successfully",
    status: 201,
  },
  errorRegisteringVenue: {
    data: null,
    message: "Error registering venue",
    status: 500,
  },
  typeErrorValidation: {
    data: null,
    message: "Invalid data",
    status: 400,
  },
  errorFetchingVenues: {
    data: null,
    message: "Error fetching venues",
    status: 500,
  },
};

export const POST = async (
  req: Request,
): Promise<NextResponse<IBaseResponse>> => {
  const body = await req.json();

  const validationResult = venueSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json({ ...errorResponse.typeErrorValidation });
  }

  const secureData = validationResult.data;

  try {
    await createVenue(secureData);
    return NextResponse.json({ ...errorResponse.registeredSuccessfully });
  } catch {
    return NextResponse.json({ ...errorResponse.errorRegisteringVenue });
  }
};

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<IBaseResponse>> => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = validatePaginationParams(
      searchParams.get("page"),
      searchParams.get("limit"),
    );
    const res = await getVenuesByPagination(page, limit);
    return NextResponse.json({
      data: { ...res },
      status: 200,
      message: "Venues fetched successfully",
    });
  } catch {
    return NextResponse.json({ ...errorResponse.errorFetchingVenues });
  }
};
