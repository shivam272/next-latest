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

export const DELETE = async (req: NextRequest) => {
  try {
    const { id, field, filePath } = await req.json();
    if (!id || !field || !filePath) {
      return NextResponse.json(
        { message: "id, field, and filePath are required" },
        { status: 400 },
      );
    }

    const { deleteFromBlob } = await import("@/services/blob.service");
    await deleteFromBlob(filePath);

    const { connectToDatabase } = await import("@/lib/mongoose");
    const Venue = (await import("@/models/venue")).default;
    await connectToDatabase();

    let updatedVenue;
    if (field === "image") {
      updatedVenue = await Venue.findByIdAndUpdate(
        id,
        { $unset: { image: 1 } },
        { new: true },
      ).lean();
    } else {
      updatedVenue = await Venue.findByIdAndUpdate(
        id,
        { $pull: { [field]: { path: filePath } } },
        { new: true },
      ).lean();
    }

    return NextResponse.json({
      message: "Deleted successfully",
      venue: updatedVenue,
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in DELETE venue file:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const field = formData.get("field") as string;
    const oldPath = formData.get("oldPath") as string | null;
    const fileIndexStr = formData.get("fileIndex") as string | null;
    const newFile = formData.get("file") as File | null;

    if (!id || !field || !newFile) {
      return NextResponse.json(
        { message: "id, field, and file are required" },
        { status: 400 },
      );
    }

    const { uploadToBlob, deleteFromBlob } =
      await import("@/services/blob.service");
    const { connectToDatabase } = await import("@/lib/mongoose");
    const Venue = (await import("@/models/venue")).default;

    if (oldPath) {
      await deleteFromBlob(oldPath);
    }

    const folder =
      field === "image"
        ? "venues/images"
        : field === "adhaarCard"
          ? "venues/adhaar"
          : "venues/qualifications";

    const newBlob = await uploadToBlob(newFile, folder);

    const storedFileData = {
      path: newBlob.path,
      publicUrl: newBlob.publicUrl,
      size: newBlob.size,
      filename: newFile.name,
      mimeType: newFile.type,
      uploadedAt: new Date(),
    };

    await connectToDatabase();
    let updatedVenue;

    if (field === "image") {
      updatedVenue = await Venue.findByIdAndUpdate(
        id,
        { $set: { image: storedFileData } },
        { new: true },
      ).lean();
    } else if (oldPath) {
      // Replace matching item in array by old path
      updatedVenue = await Venue.findOneAndUpdate(
        { _id: id, [`${field}.path`]: oldPath },
        { $set: { [`${field}.$`]: storedFileData } },
        { new: true },
      ).lean();
    } else if (fileIndexStr !== null && !isNaN(Number(fileIndexStr))) {
      const idx = Number(fileIndexStr);
      updatedVenue = await Venue.findByIdAndUpdate(
        id,
        { $set: { [`${field}.${idx}`]: storedFileData } },
        { new: true },
      ).lean();
    } else {
      // Append if no index or oldPath
      updatedVenue = await Venue.findByIdAndUpdate(
        id,
        { $push: { [field]: storedFileData } },
        { new: true },
      ).lean();
    }

    return NextResponse.json({
      message: "Updated successfully",
      venue: updatedVenue,
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in PATCH venue file:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
