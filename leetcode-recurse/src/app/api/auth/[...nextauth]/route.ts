"use server";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/database/connection";
import User from "@/database/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      //  Ensure DB is connected
      console.log("user full info retrieved: ", user);
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

        console.log(" New user created:", existingUser._id);
      } else {
        console.log("✔Existing user:", existingUser._id);
      }

      // 4 Attach DB id to user object for JWT callback
      user.id = existingUser._id.toString();

      return true;
    },

    async jwt({ token, user }) {
      // When user signs in for first time, add MongoDB id to token
      if (user) {
        token.user = user;
      }
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
