"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import UpcomingReviews from "./dashboard/UpcomingReviews";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;
  // const [calendarOk, setCalendarOk] = useState<boolean | null>(null);
  // useEffect(() => {
  //   const accessToken = (session as any)?.accessToken;
  //   if (!accessToken) return;

  //   fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   })
  //     .then((res) => {
  //       setCalendarOk(res.ok);
  //     })
  //     .catch(() => {
  //       setCalendarOk(false);
  //     });
  // }, [session]);

  return (
    <div className="">
      <Navbar />
      <div className="relative min-h-screen w-full bg-zinc-50 dark:bg-black flex items-start justify-center py-12 mt-10">
        {/* Avatar + Account Popover */}
        {user && (
          <div className="fixed bottom-3 right-4 z-50">
            <Popover>
              <PopoverTrigger>
                <Avatar className="cursor-pointer shadow">
                  <AvatarImage
                    src={user?.image ?? "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-52 p-3 space-y-3 rounded-xl shadow-lg border bg-white dark:bg-zinc-900">
                <>
                  {/* USER INFO */}
                  <div className="text-sm text-gray-700 dark:text-gray-300 ">
                    Signed in as <br />
                    <b className="text-gray-900 dark:text-white">{user.name}</b>
                  </div>

                  {/* ACCOUNT SETTINGS */}
                  <div className="flex flex-col justify-around gap-2">
                    <Link href="/account-settings">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left cursor-pointer"
                      >
                        Account Settings
                      </Button>
                    </Link>

                    {/* SIGN OUT */}
                    <Button
                      variant="outline"
                      className="w-full justify-start cursor-pointer"
                      onClick={async () => {
                        signOut();
                        await toast.promise<{ name: string }>(
                          () =>
                            new Promise((resolve) =>
                              setTimeout(
                                () => resolve({ name: user?.name ?? "You" }),
                                300
                              )
                            ),
                          {
                            loading: "Logging user Out...",
                            success: (data) =>
                              `${data.name} have been successfully logged out. May take 1 or 2 second to change screen`,
                            error: "Error",
                          }
                        );
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Main */}
        <div className="w-full max-w-4xl px-6 space-y-16">
          {!user && (
            <section className="flex flex-col items-center text-center space-y-6 py-10">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Welcome 👋
              </h1>

              <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                Sign in to access your dashboard, track problems, and continue
                your learning journey.
              </p>

              {/* Login card */}
              <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm rounded-2xl p-6 flex flex-col items-center gap-6">
                {/* Google Icon */}
                <div className="h-14 w-14 rounded-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800 shadow-inner">
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google Logo"
                    className="h-7 w-7"
                  />
                </div>

                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Sign in with Google
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quick, secure, and no passwords needed.
                </p>

                <Button
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: "/",
                      prompt: "consent",
                      access_type: "offline",
                    })
                  }
                  className="w-full py-5 text-base font-medium flex items-center justify-center gap-3 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                  variant="outline"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="google"
                    className="h-5 w-5"
                  />
                  Continue with Google
                </Button>
              </div>
            </section>
          )}

          {user && (
            <>
              <section className="space-y-6">
                <h2 className="text-3xl font-bold text-center">
                  {" "}
                  Programmatic Navigation
                </h2>
                {/* <h1>Access Token : {JSON.stringify(user, null, 2)}</h1> */}
                {/* <div>
                  Google Calendar Access:{" "}
                  {calendarOk === null ? "...d" : calendarOk ? "YES" : "NO"}
                </div> */}

                <div className="bg-white dark:bg-zinc-900 shadow-sm border rounded-xl p-6 space-y-3 text-lg">
                  <p className="cursor-pointer">
                    Dashboard →{" "}
                    <Link href="/dashboard">
                      <code className="text-blue-600">/dashboard</code>
                    </Link>
                  </p>
                  <p>
                    Add Problem →{" "}
                    <Link href="/problems">
                      <code className="text-blue-600">/problems</code>
                    </Link>
                  </p>

                  <p>
                    View Problems →{" "}
                    <Link href="/view-problems">
                      <code className="text-blue-600">/view-problems</code>
                    </Link>
                  </p>
                  <p>
                    Account Settings →{" "}
                    <Link href="account-settings">
                      <code className="text-blue-600">/account-settings</code>
                    </Link>
                  </p>
                  <p>
                    Documentation →{" "}
                    <Link href="/docs">
                      <code className="text-blue-600">/docs</code>
                    </Link>
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">
                  Problems to Solve This Week
                </h2>

                <div className="w-full m-auto ">
                  <UpcomingReviews />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
