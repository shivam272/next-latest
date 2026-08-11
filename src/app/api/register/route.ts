import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/user";
import { hashPassword } from "@/utils/server.utils";

const errorResponse = {
  alreadyExists: {
    message: "User already exists",
    status: 500,
  },
  registeredSuccessfully: {
    message: "User registered successfully",
    status: 201,
  },
  errorRegisteringUser: {
    message: "Error registering user",
    status: 501,
  },
};

export const POST = async (req: Request): Promise<Response> => {
  const {
    firstName,
    lastName,
    age,
    email,
    gender,
    password,
    terms,
    phone,
    cities,
  } = await req.json();

  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return Response.json({ ...errorResponse.alreadyExists });
  }

  const newUser = new User({
    firstName,
    lastName,
    age,
    email,
    gender,
    password: await hashPassword(password),
    terms,
    phone,
    cities,
  });

  try {
    await newUser.save();
    return Response.json({ ...errorResponse.registeredSuccessfully });
  } catch {
    return Response.json({ ...errorResponse.errorRegisteringUser });
  }
};

export const GET = async (): Promise<Response> => {
  // dummy response for GET request
  const dummyPromise = new Promise<Response>((resolve) => {
    setTimeout(() => {
      resolve(Response.json({ message: "GET request received", status: 3000 }));
    }, 1000);
  });
  return dummyPromise;
};
