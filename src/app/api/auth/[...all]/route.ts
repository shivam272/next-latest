// import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { connectToDatabase } from "@/lib/mongoose";
// import User from "@/models/user";
// import { comparePassword } from "@/utils/server.utils";

// const handlers = NextAuth({
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: {
//           label: "Username/Email",
//           type: "text",
//           placeholder: "test@test.com",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "Enter your password",
//         },
//       },
//       async authorize(credentials) {
//         await connectToDatabase();

//         const user = await User.findOne({ email: credentials?.username });
//         if (!user) {
//           return null;
//         }

//         const isPasswordValid = await comparePassword(
//           credentials?.password as string,
//           user.password,
//         );
//         if (isPasswordValid) {
//           return user;
//         }

//         return null;
//       },
//     }),
//   ],
// });

// export { handlers as GET, handlers as POST };

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
