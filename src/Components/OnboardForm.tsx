"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  signInEmail,
  signUpEmail,
  signInWithGithub,
  signInWithGoogle,
} from "@/actions/server";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface SignInForm {
  email: string;
  password: string;
}

interface SignUpForm extends SignInForm {
  name: string;
}

export const OnboardForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpForm>({
    mode: "onTouched",
  });

  // server action not preferred for OAuth

  const signInWithGithubHandler = async () => {
    const response = await signInWithGithub();

    if (!response.success) {
      toast.error(response.message);
      setAuthError(response.message);
      return;
    }
    toast.success(response.message);
    reset();
    redirect("/");
  };

  const signInWithGoogleHandler = async () => {
    const response = await signInWithGoogle();
    if (!response.success) {
      toast.error(response.message);
      setAuthError(response.message);
      return;
    }
    toast.success(response.message);
    reset();
    redirect("/");
  };

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",

      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error(error.message);
    }
  };

  const handleGithubSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "github",

      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error(error.message);
    }
  };

  const onSubmit = async (data: SignUpForm) => {
    setAuthError(null);

    const response = isSignUp
      ? await signUpEmail(data)
      : await signInEmail(data);

    if (!response.success) {
      toast.error(response.message);
      setAuthError(response.message);
      return;
    }
    toast.success(response.message);
    reset();
    redirect("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-white text-center">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>

        <p className="mt-2 text-center text-sm text-gray-400">
          {isSignUp
            ? "Create your account to continue."
            : "Sign in to your account."}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
          noValidate
        >
          {isSignUp && (
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Full Name
              </label>

              <input
                {...register("name", {
                  required: "Name is required",
                })}
                placeholder="John Doe"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Invalid email",
                },
              })}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Password</label>
            <input
              type="password"
              placeholder="********"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 2,
                  message: "Minimum 2 characters",
                },
              })}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {authError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {authError}
            </div>
          )}

          <button
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Please wait..."
              : isSignUp
                ? "Create Account"
                : "Sign In"}
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

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white transition hover:bg-white/15"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.146 35.091 26.715 36 24 36c-5.202 0-9.623-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.047 12.047 0 0 1-4.084 5.571h.003l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGithubSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white transition hover:bg-white/15"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M12 .5C5.649.5.5 5.649.5 12a11.5 11.5 0 008.207 10.958c.6.111.793-.261.793-.579v-2.04c-3.338.725-4.042-1.608-4.042-1.608-.546-1.387-1.333-1.757-1.333-1.757-1.091-.746.083-.731.083-.731 1.205.085 1.839 1.238 1.839 1.238 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.303-5.466-1.333-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.304-.536-1.526.117-3.181 0 0 1.008-.323 3.301 1.23a11.47 11.47 0 016.006 0c2.292-1.553 3.299-1.23 3.299-1.23.654 1.655.242 2.877.119 3.181.769.84 1.235 1.911 1.235 3.221 0 4.609-2.805 5.625-5.478 5.922.43.369.813 1.096.813 2.209v3.273c0 .32.191.695.8.577A11.5 11.5 0 0023.5 12C23.5 5.649 18.351.5 12 .5z" />
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isSignUp ? (
            <>
              {`Already have an account? `}
              <button
                onClick={() => {
                  reset();
                  setIsSignUp(false);
                }}
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              {`Don't have an account? `}
              <button
                onClick={() => {
                  reset();
                  setIsSignUp(true);
                }}
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
