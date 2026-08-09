import { createVenue, getAllVenues } from "@/services";
import { venueSchema } from "@/schema/venueSchema";

const errorResponse = {
  registeredSuccessfully: {
    message: "Venue saved successfully",
    status: 201,
  },
  errorRegisteringVenue: {
    message: "Error registering venue",
    status: 500,
  },
  typeErrorValidation: {
    message: "Invalid data",
    status: 400,
  },
  errorFetchingVenues: {
    message: "Error fetching venues",
    status: 500,
  },
};

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const validationResult = venueSchema.safeParse(body);

  if (!validationResult.success) {
    return Response.json({ ...errorResponse.typeErrorValidation });
  }

  const secureData = validationResult.data;

  try {
    await createVenue(secureData);
    return Response.json({ ...errorResponse.registeredSuccessfully });
  } catch {
    return Response.json({ ...errorResponse.errorRegisteringVenue });
  }
};

export const GET = async (): Promise<Response> => {
  try {
    const venues = await getAllVenues();
    return Response.json({
      data: venues,
      status: 200,
      message: "Venues fetched successfully",
    });
  } catch (error) {
    return Response.json({ ...errorResponse.errorFetchingVenues });
  }
};
