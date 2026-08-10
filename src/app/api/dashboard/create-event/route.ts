import { createEvent } from "@/services";
import { eventSchemaServer } from "@/schema";
import { Types } from "mongoose";

const errorResponse = {
  registeredSuccessfully: {
    message: "Event saved successfully",
    status: 201,
  },
  errorRegisteringEvent: {
    message: "Error registering event",
    status: 500,
  },
  typeErrorValidation: {
    message: "Invalid data",
    status: 400,
  },
};

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const validationResult = eventSchemaServer.safeParse(body);

  if (!validationResult.success) {
    return Response.json({ ...errorResponse.typeErrorValidation });
  }

  const { venueId, ...secureData } = validationResult.data;

  try {
    await createEvent({
      ...secureData,
      venueId: new Types.ObjectId(venueId),
    });
    return Response.json({ ...errorResponse.registeredSuccessfully });
  } catch {
    return Response.json({ ...errorResponse.errorRegisteringEvent });
  }
};
