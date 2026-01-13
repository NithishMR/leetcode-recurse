"use server";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/database/connection";
import User from "@/database/User";
import { sendWelcomeMailToNewUser } from "@/utils/newUserMail";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      //  Ensure DB is connected
      //console.log("user full info retrieved: ", user);
      await connectDB();

      //  Look for user in MongoDB
      let existingUser = await User.findOne({ email: user.email });

      //  If first time → create user
      if (!existingUser) {
        existingUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
        sendWelcomeMailToNewUser({
          to: existingUser.email,
          username: existingUser.name,
        }).catch((err) => console.error("Welcome mail failed:", err));

        console.log("Auth sign-in:", user.email);
      } else {
        console.log("✔Existing user:");
      }

      // 4 Attach DB id to user object for JWT callback
      user.id = existingUser._id.toString();

      return true;
    },

    async jwt({ token, user, account }) {
      // When user signs in for first time, add MongoDB id to token
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.user = user;
      }
      // console.log("toki token", token);
      return token;
    },

    async session({ session, token }) {
      // Pass data to client session
      session.user = token.user as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
