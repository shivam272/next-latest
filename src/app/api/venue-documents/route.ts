import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { VenueDocument } from "@/models/venueDocument";
import { venueDocumentServerSchema } from "@/schema/venueDocumentSchema";
import { uploadToBlob, uploadMultipleToBlob, deleteFromBlob, deleteMultipleFromBlob } from "@/services/blob.service";

export const GET = async () => {
  await connectToDatabase();
  const data = await VenueDocument.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ data, status: 200 });
};

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const rawData = {
      name: formData.get("name"),
      image: formData.get("image"),
      adhaar: formData.get("adhaar"),
      qualification: formData.getAll("qualification"),
    };

    const parsed = venueDocumentServerSchema.safeParse(rawData);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid data", errors: parsed.error.format() }, { status: 400 });
    }

    const { name, image, adhaar, qualification } = parsed.data;

    const [uploadedImage, uploadedAdhaar, uploadedQualifications] = await Promise.all([
      uploadToBlob(image, "images"),
      uploadToBlob(adhaar, "adhaar"),
      uploadMultipleToBlob(qualification, "qualifications"),
    ]);

    await connectToDatabase();
    const newDoc = await VenueDocument.create({
      name,
      image: { path: uploadedImage.path, size: uploadedImage.size },
      adhaar: { path: uploadedAdhaar.path, size: uploadedAdhaar.size },
      qualification: uploadedQualifications.map((q) => ({ path: q.path, size: q.size })),
    });

    return NextResponse.json({ message: "Created successfully", data: newDoc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    await connectToDatabase();
    const existing = await VenueDocument.findById(id);
    if (!existing) return NextResponse.json({ message: "Record not found" }, { status: 404 });

    const updatePayload: Record<string, any> = {};
    const name = formData.get("name") as string | null;
    if (name) updatePayload.name = name;

    const newImage = formData.get("image") as File | null;
    if (newImage && newImage.size > 0) {
      await deleteFromBlob(existing.image.path);
      const res = await uploadToBlob(newImage, "images");
      updatePayload.image = { path: res.path, size: res.size };
    }

    const newAdhaar = formData.get("adhaar") as File | null;
    if (newAdhaar && newAdhaar.size > 0) {
      await deleteFromBlob(existing.adhaar.path);
      const res = await uploadToBlob(newAdhaar, "adhaar");
      updatePayload.adhaar = { path: res.path, size: res.size };
    }

    const newQualifications = formData.getAll("qualification") as File[];
    if (newQualifications.length > 0 && newQualifications[0].size > 0) {
      await deleteMultipleFromBlob(existing.qualification.map((q: any) => q.path));
      const res = await uploadMultipleToBlob(newQualifications, "qualifications");
      updatePayload.qualification = res.map((q) => ({ path: q.path, size: q.size }));
    }

    const updated = await VenueDocument.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });
    return NextResponse.json({ message: "Updated successfully", data: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
