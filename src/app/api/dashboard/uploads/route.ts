import { connectToDatabase } from "@/lib/mongoose";
import Upload from "@/models/upload";

export async function GET() {
  try {
    await connectToDatabase();
    const submissions = await Upload.find().sort({ _id: -1 }).lean();
    return Response.json(submissions);
  } catch {
    return Response.json(
      { message: "Could not load uploads" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, files } = await request.json();
    await connectToDatabase();
    const submission = await Upload.create({ title, files });
    return Response.json(submission, { status: 201 });
  } catch {
    return Response.json(
      { message: "Could not save uploads" },
      { status: 500 },
    );
  }
}
