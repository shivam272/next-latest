import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export async function POST(request: Request) {
  try {
    const body: HandleUploadBody = await request.json();
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        addRandomSuffix: true,
        cacheControlMaxAge: 31536000,
      }),
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
