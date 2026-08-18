"use server";

import { ICompleteProfileForm, TApiResponse } from "@/types";
import { profileSchema } from "@/schema/signupSchema";
import { submitProfile } from "@/services";

const responseConfig = {
  registeredSuccessfully: {
    success: true,
    message: "Profile saved successfully",
    status: 201,
  },
  errorRegisteringEvent: {
    success: false,
    message: "Error saving profile",
    status: 500,
  },
  typeErrorValidation: {
    success: false,
    message: "Invalid Profile data",
    status: 400,
  },
};

export const completeProfile = async (
  profileData: ICompleteProfileForm,
): Promise<TApiResponse<null>> => {
  const validationResult = profileSchema.safeParse(profileData);

  if (!validationResult.success) {
    return { ...responseConfig.typeErrorValidation };
  }

  try {
    await submitProfile(profileData);
    return { ...responseConfig.registeredSuccessfully };
  } catch {
    return { ...responseConfig.errorRegisteringEvent };
  }
};
