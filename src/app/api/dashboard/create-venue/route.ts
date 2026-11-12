import { createVenue, getVenuesByPagination, uploadToBlob } from "@/services";
import { venueServerSchema } from "@/schema";
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
  req: NextRequest,
): Promise<NextResponse<IBaseResponse>> => {
  const formData = await req.formData();

  let venueDataParsed;

  try {
    const venueData = formData.get("venueData");
    if (typeof venueData !== "string") {
      return NextResponse.json({
        ...errorResponse.typeErrorValidation,
        message: "venueData must be a string",
      });
    }
    venueDataParsed = JSON.parse(venueData as string);
  } catch {
    return NextResponse.json({
      ...errorResponse.typeErrorValidation,
      message: "Invalid JSON in venueData",
    });
  }

  const rawImage = formData.get("image");
  const rawAdhaar = formData.getAll("adhaarCard");
  const rawQual = formData.getAll("qualification");

  const validationResult = venueServerSchema.safeParse({
    ...venueDataParsed,
    image: rawImage instanceof File ? rawImage : undefined,
    adhaarCard: rawAdhaar.filter((f): f is File => f instanceof File),
    qualification: rawQual.filter((f): f is File => f instanceof File),
  });

  if (!validationResult.success) {
    return NextResponse.json({ ...errorResponse.typeErrorValidation });
  }

  const secureData = validationResult.data;

  const { image, adhaarCard = [], qualification = [] } = secureData;

  let uploadedImage;
  if (image) {
    const blob = await uploadToBlob(image, "venues/images");
    uploadedImage = {
      path: blob.path,
      publicUrl: blob.publicUrl,
      size: blob.size,
      filename: image.name,
      mimeType: image.type,
      uploadedAt: new Date(),
    };
  }

  const uploadedAdhaar = await Promise.all(
    adhaarCard.map(async (file) => {
      const blob = await uploadToBlob(file, "venues/adhaar");
      return {
        path: blob.path,
        publicUrl: blob.publicUrl,
        size: blob.size,
        filename: file.name,
        mimeType: file.type,
        uploadedAt: new Date(),
      };
    }),
  );

  const uploadedQualification = await Promise.all(
    qualification.map(async (file) => {
      const blob = await uploadToBlob(file, "venues/qualifications");
      return {
        path: blob.path,
        publicUrl: blob.publicUrl,
        size: blob.size,
        filename: file.name,
        mimeType: file.type,
        uploadedAt: new Date(),
      };
    }),
  );

  try {
    await createVenue({
      ...secureData,
      image: uploadedImage,
      adhaarCard: uploadedAdhaar,
      qualification: uploadedQualification,
    });
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
