"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import UpcomingReviews from "./dashboard/UpcomingReviews";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="relative min-h-screen w-full bg-zinc-50 dark:bg-black flex items-start justify-center py-12">
      {/* Avatar + Account Popover */}
      <div className="fixed top-4 right-4 z-50">
        <Popover>
          <PopoverTrigger>
            <Avatar className="cursor-pointer shadow">
              <AvatarImage
                src={user?.image ?? "https://github.com/shadcn.png"}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </PopoverTrigger>

          <PopoverContent className="w-48 space-y-2">
            {user ? (
              <>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Signed in as <b>{user.name}</b>
                </div>

                <Button variant="outline" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => signIn("google")}>Sign In</Button>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Main */}
      <div className="w-full max-w-4xl px-6 space-y-16">
        <section className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {user ? `Welcome back, ${user.name} 👋` : "Welcome 👋"}
          </h1>

          {!user && (
            <Button onClick={() => signIn("google")} className="mt-4">
              Sign in to continue →
            </Button>
          )}
        </section>

        {user && (
          <>
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-center">Navigation</h2>

              <div className="bg-white dark:bg-zinc-900 shadow-sm border rounded-xl p-6 space-y-3 text-lg">
                <p>
                  Dashboard → <code className="text-blue-600">/dashboard</code>
                </p>
                <p>
                  Add Problem → <code className="text-blue-600">/problems</code>
                </p>
                <p>
                  View Problems →{" "}
                  <code className="text-blue-600">/view-problems</code>
                </p>
                <p>
                  Account Settings →{" "}
                  <code className="text-blue-600">/account-settings</code>
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-center">
                Problems to Solve This Week
              </h2>

              <div className="flex justify-center">
                <UpcomingReviews />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
