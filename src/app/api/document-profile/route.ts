import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { DocumentProfile } from "@/models/documentProfile";
import {
  uploadToBlob,
  uploadMultipleToBlob,
  deleteFromBlob,
  deleteMultipleFromBlob,
} from "@/services/blob.service";

export const GET = async () => {
  await connectToDatabase();
  const profiles = await DocumentProfile.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ data: profiles, status: 200 });
};

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File;
    const adhaarFile = formData.get("adhaar") as File;
    const qualificationFiles = formData.getAll("qualification") as File[];

    if (!name || !imageFile || !adhaarFile || qualificationFiles.length === 0) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const [image, adhaar, qualification] = await Promise.all([
      uploadToBlob(imageFile, "images"),
      uploadToBlob(adhaarFile, "adhaar"),
      uploadMultipleToBlob(qualificationFiles, "qualifications"),
    ]);

    await connectToDatabase();
    const newDoc = await DocumentProfile.create({
      name,
      image,
      adhaar,
      qualification,
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

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await DocumentProfile.findById(id);
    if (!existing) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    const updatePayload: Record<string, any> = {};
    const name = formData.get("name") as string | null;
    if (name) updatePayload.name = name;

    const newImage = formData.get("image") as File | null;
    if (newImage && newImage.size > 0) {
      await deleteFromBlob(existing.image.path);
      updatePayload.image = await uploadToBlob(newImage, "images");
    }

    const newAdhaar = formData.get("adhaar") as File | null;
    if (newAdhaar && newAdhaar.size > 0) {
      await deleteFromBlob(existing.adhaar.path);
      updatePayload.adhaar = await uploadToBlob(newAdhaar, "adhaar");
    }

    const newQualifications = formData.getAll("qualification") as File[];
    if (newQualifications.length > 0 && newQualifications[0].size > 0) {
      const oldPaths = existing.qualification.map((q: any) => q.path);
      await deleteMultipleFromBlob(oldPaths);
      updatePayload.qualification = await uploadMultipleToBlob(newQualifications, "qualifications");
    }

    const updated = await DocumentProfile.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });
    return NextResponse.json({ message: "Updated successfully", data: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const doc = await DocumentProfile.findById(id);
    if (!doc) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    const allPathsToDelete = [
      doc.image.path,
      doc.adhaar.path,
      ...doc.qualification.map((q: any) => q.path),
    ];
    await deleteMultipleFromBlob(allPathsToDelete);

    await DocumentProfile.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
