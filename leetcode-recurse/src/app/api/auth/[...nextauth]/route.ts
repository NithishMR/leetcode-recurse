"use server";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
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
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
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
      }

      // ✅ Save Google token to DB
      if (account?.provider === "google") {
        existingUser.googleAccessToken = account.access_token;
        await existingUser.save();
      }

      // ✅ Save GitHub token to DB (unchanged)
      if (account?.provider === "github") {
        const res = await fetch("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${account.access_token}` },
        });
        const githubData = await res.json();
        existingUser.githubAccessToken = account.access_token;
        existingUser.githubUsername = githubData.login;
        await existingUser.save();
      }

      user.id = existingUser._id.toString();
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
      }

      if (account?.provider === "google") {
        token.accessToken = account.access_token;
      }

      if (account?.provider === "github") {
        token.githubAccessToken = account.access_token;
        token.githubUsername = account.providerAccountId;
      }

      const userId = (token.user as any)?.id;
      if (userId) {
        await connectDB();
        const dbUser = await User.findById(userId);

        if (!token.accessToken && dbUser?.googleAccessToken) {
          token.accessToken = dbUser.googleAccessToken;
        }

        if (!token.githubAccessToken && dbUser?.githubAccessToken) {
          token.githubAccessToken = dbUser.githubAccessToken;
        }
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
