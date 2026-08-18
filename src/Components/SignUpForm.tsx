"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "react-toastify";
import { signupSchema } from "@/schema";
import { registrationDetails } from "@/actions/server";
import type { ISignUpForm } from "@/types";
import { useRouter } from "next/navigation";

export const SignUpForm = () => {
  const { register, handleSubmit, formState } = useForm<ISignUpForm>({
    mode: "onTouched",
    resolver: zodResolver(signupSchema),
  });

  const { data } = useSession();
  const { user } = data || {};

  const router = useRouter();

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push("/signUp/complete-profile");
    }
  }, [user?.emailVerified]);

  const { errors, isSubmitting, isValid } = formState;

  const onSubmit = async (data: ISignUpForm) => {
    const { name, email, password, barId } = data;

    const response = await registrationDetails({
      name,
      email,
      password,
      barId,
    });
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);

    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/signUp/complete-profile",
      });
      toast.success(
        "If an account exists with that email, we've sent you a verification email.",
      );
    } catch (err) {
      console.error("Failed to send verification email", err);
      toast.error("Failed to send verification email");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-white text-center">
          Create Account
        </h1>

        <p className="mt-2 text-center text-sm text-gray-400">
          Email and Bar ID are used for profile verification.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
          noValidate
        >
          <div>
            <label className="mb-2 block text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Bar ID */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">Bar ID</label>

            <input
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
            <label className="mb-2 block text-sm text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                placeholder="********"
                {...register("password")}
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="********"
                {...register("confirmPassword")}
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Validate & Create Account"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-slate-950 px-4 text-sm text-gray-400">
              or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          {`Already have an account? `}

          <Link
            href="/signIn"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
