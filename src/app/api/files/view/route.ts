import { NextRequest, NextResponse } from "next/server";
import { getPrivateBlob } from "@/services/blob.service";

export const GET = async (request: NextRequest) => {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing file path" }, { status: 400 });
  }

  const result = await getPrivateBlob(path);

  if (!result || result.statusCode !== 200) {
    return new NextResponse("File not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
};
