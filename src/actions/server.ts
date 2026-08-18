// server action

"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { IAccountInput, IRegistrationInput } from "@/types/index";
import { connectToDatabase } from "@/lib/mongoose";

interface IAccountOutput {
  success: boolean;
  message: string;
}

export const signUpEmail = async (
  config: IAccountInput,
): Promise<IAccountOutput> => {
  const { email, password, name } = config;

  try {
    const authResponse = await auth.api.signUpEmail({
      body: {
        email,
        password, // no need to hash the password, better-auth will handle it for you
        name,
        // load the url after use is successully registered, this is optional and can be set to any url you want
        callbackURL: "/dashboard",
      },
      headers: await headers(),
    });

    if (!authResponse) {
      return { success: false, message: "Sign up failed" };
    }
    return { success: true, message: "Sign up successful" };
  } catch {
    return { success: false, message: "Sign up failed" };
  }
};

export const registrationDetails = async (
  config: IRegistrationInput,
): Promise<IAccountOutput> => {
  const { email, name, barId, password } = config;
  try {
    const authResponse = await auth.api.signUpEmail({
      body: {
        email,
        password, // no need to hash the password, better-auth will handle it
        name,
        barId,
      },
      headers: await headers(),
    });

    if (!authResponse) {
      return { success: false, message: "registration failed" };
    }
    return { success: true, message: "registration successful" };
  } catch {
    return { success: false, message: "registration failed" };
  }
};

export const signInEmail = async (
  config: Pick<IAccountInput, "email" | "password">,
): Promise<IAccountOutput> => {
  const { email, password } = config;

  try {
    const authResponse = await auth.api.signInEmail({
      body: {
        email,
        password,
        // load the url after use is successully registered, this is optional and can be set to any url you want
        callbackURL: "/dashboard",
      },
      headers: await headers(),
    });

    if (!authResponse) {
      return { success: false, message: "Sign in failed" };
    }
    return { success: true, message: "Sign in successful" };
  } catch {
    return { success: false, message: "Sign in failed" };
  }
};

export const signOut = async (): Promise<IAccountOutput> => {
  try {
    const authResponse = await auth.api.signOut({
      headers: await headers(),
    });

    if (!authResponse) {
      return { success: false, message: "Sign out failed" };
    }
    return { success: true, message: "Sign out successful" };
  } catch {
    return { success: false, message: "Sign out failed" };
  }
};

export const checkDatabaseConnection = async () => {
  try {
    const mongoose = await connectToDatabase();
    return {
      success: true,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      readyState: mongoose.connection.readyState,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// export const signInWithGoogle = async (): Promise<IAccountOutput> => {
//   try {
//     const res = await auth.api.signInSocial({
//       body: {
//         provider: "google",
//         callbackURL: "/dashboard",
//       },
//     });
//     if (!res) {
//       return { success: false, message: "Sign in with Google failed" };
//     }
//     return { success: true, message: "Sign in with Google successful" };
//   } catch {
//     return { success: false, message: "Sign in with Google failed" };
//   }
// };

// export const signInWithGithub = async (): Promise<IAccountOutput> => {
//   try {
//     const res = await auth.api.signInSocial({
//       body: {
//         provider: "github",
//         callbackURL: "/dashboard",
//       },
//     });
//     if (!res) {
//       return { success: false, message: "Sign in with Github failed" };
//     }
//     return { success: true, message: "Sign in with Github successful" };
//   } catch {
//     return { success: false, message: "Sign in with Github failed" };
//   }
// };
