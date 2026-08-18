import { connectToDatabase } from "@/lib/mongoose";
import { ProfileModel } from "@/models/profile";
import { ICompleteProfileForm } from "@/types";
import { Types } from "mongoose";

export const submitProfile = async (profileForm: ICompleteProfileForm) => {
  await connectToDatabase();

  console.log("Profile Form Data:", profileForm); // Log the profile form data for debugging

  const { name, email, barId, telephone, gender, age, userId } = profileForm;
  await ProfileModel.create({
    _id: new Types.ObjectId(userId),
    name,
    email,
    barId,
    telephone,
    gender,
    age,
  });
};
