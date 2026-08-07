import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getNativeDb } from "./mongoose";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email";

const { db, client } = await getNativeDb();

export const auth = betterAuth({
  appName: "MyNextApp",
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 2,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
					<h1>Reset your password</h1>
					<p>Please click the link below to reset your password:</p>
					<a href="${url}">Reset Password</a>
				`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
});
