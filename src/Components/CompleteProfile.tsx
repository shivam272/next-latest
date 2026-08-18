"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ICompleteProfileForm, EGenderEnum } from "@/types";
import { profileSchema } from "@/schema";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
import { completeProfile } from "@/actions/profile.action";

interface ICompleteProfileFormProps {
  name: string;
  barId?: string;
  email: string;
  userId: string;
}

export const CompleteProfileForm = (props: ICompleteProfileFormProps) => {
  const { name, barId = "", email, userId } = props;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ICompleteProfileForm>({
    defaultValues: {
      name,
      barId,
      email,
      userId,
      age: "",
      gender: EGenderEnum.male,
      telephone: "",
    },
    mode: "onTouched",
    resolver: zodResolver(profileSchema),
  });

  const onSubmitHandler = async (data: ICompleteProfileForm) => {
    const res = await completeProfile(data);

    if (res.success) {
      toast.success("Profile completed successfully!");
    } else {
      toast.error(res.message || "Failed to complete profile.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-white text-center">
          Complete your Profile
        </h1>

        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="mt-8 space-y-5"
          noValidate
        >
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">Email</label>
            <input
              disabled={Boolean(email)}
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />
          </div>

          {/* Bar ID */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">Bar ID</label>

            <input
              disabled={Boolean(barId)}
              type="text"
              placeholder="Enter your Bar ID"
              {...register("barId")}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />

            {errors.barId && (
              <p className="mt-1 text-sm text-red-400">
                {errors.barId.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">Name</label>

            <input
              disabled={Boolean(name)}
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Choose a Gender
              </label>
              <select
                id="gender"
                {...register("gender")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="male">{EGenderEnum.male}</option>
                <option value="female">{EGenderEnum.female}</option>
                <option value="other">{EGenderEnum.other}</option>
              </select>
            </div>

            <div className="w-1/2">
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Age
              </label>
              <input
                type="string"
                id="age"
                placeholder="type your age"
                {...register("age")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.age.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="primaryPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Primary Phone
            </label>
            <input
              type="tel"
              id="primaryPhone"
              placeholder="9876543210"
              {...register("telephone")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.telephone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.telephone.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : (
              "Complete Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
