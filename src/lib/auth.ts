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
  user: {
    additionalFields: {
      barId: {
        type: "string",
        required: false,
        default: "",
      },
    },
  },
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
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
          <h1>Verify your email</h1>
          <p>Hello ${user.name},</p>
          <p>
            Please click the button below to verify your email address.
          </p>
          <a
            href="${url}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
              "
          >
            Verify Email
          </a>
          <p>
            If you didn't create an account, you can safely ignore this email.
          </p>
        `,
      });
    },
  },
  plugins: [nextCookies()],
});
