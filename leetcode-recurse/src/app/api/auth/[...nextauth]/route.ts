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
    async signIn({ user, account }) {
      await connectDB();

      let existingUser = await User.findOne({ email: user.email });

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
      } else {
        // Optional: keep user info fresh on sign in
        existingUser.name = user.name || existingUser.name;
        existingUser.image = user.image || existingUser.image;
      }

      //  Save Google access token for Calendar usage
      if (account?.provider === "google") {
        existingUser.googleAccessToken = account.access_token;
        await existingUser.save();
      }

      user.id = existingUser._id.toString();
      return true;
    },

    async jwt({ token, user, account }) {
      // Store user object in JWT
      if (user) {
        token.user = user;
      }

      // Save Google token at sign-in time
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
      }

      // Restore Google token from DB if missing
      const userId = (token.user as any)?.id;
      if (userId) {
        await connectDB();
        const dbUser = await User.findById(userId);

        if (!token.accessToken && dbUser?.googleAccessToken) {
          token.accessToken = dbUser.googleAccessToken;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
