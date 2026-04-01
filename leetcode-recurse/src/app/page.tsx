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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNextStep } from "nextstepjs";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;
  const { startNextStep } = useNextStep();
  const { mutate } = useSWRConfig();
  const { data: githubStatus } = useSWR(
    user ? "/api/github/status" : null,
    fetcher,
  );
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
                  <AvatarFallback>
                    <b>U</b>
                  </AvatarFallback>
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
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left cursor-pointer"
                      onClick={() => startNextStep("docs-demo")}
                    >
                      🧭 Anamnesis Tour
                    </Button>
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
                                300,
                              ),
                            ),
                          {
                            loading: "Logging user Out...",
                            success: (data) =>
                              `${data.name} have been successfully logged out. May take 1 or 2 second to change screen`,
                            error: "Error",
                          },
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
              <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
                <section
                  className="space-y-4 pb-10 w-full"
                  id="upcoming-reviews"
                >
                  <h2 className="text-2xl font-semibold text-center">
                    Problems to Solve This Week
                  </h2>

                  <div className="w-full m-auto ">
                    <UpcomingReviews />
                  </div>
                </section>
                {/* two grid layout */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  {/* LEFT CARD SLOT */}
                  <div className="h-full min-h-[380px]">
                    {githubStatus && !githubStatus.isGithubConnected && (
                      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 h-full w-full flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl">
                              🐙
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Connect GitHub
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Link your GitHub account to start saving your
                                review solutions.
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-full mt-6 py-5 text-base font-medium border border-gray-300 dark:border-zinc-700 bg-white text-black dark:text-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                          onClick={() => signIn("github")}
                        >
                          Connect GitHub
                        </Button>
                      </div>
                    )}

                    {githubStatus?.isGithubConnected &&
                      !githubStatus?.hasRepo && (
                        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 h-full w-full flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl">
                                📦
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  Initialize GitHub Repo
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Create your solution repository so Anamnesis
                                  can store your review attempts.
                                </p>
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  "/api/github/repo-init",
                                  {
                                    method: "POST",
                                  },
                                );

                                const data = await res.json();

                                if (!res.ok) {
                                  alert(data.error || "Something went wrong");
                                  return;
                                }

                                alert(data.message);
                                mutate("/api/github/status");
                              } catch (err) {
                                console.error(err);
                                alert("Failed to initialize repo");
                              }
                            }}
                            className="w-full mt-6 py-5 text-base font-medium border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                          >
                            Initialize GitHub Repo
                          </Button>
                        </div>
                      )}

                    {githubStatus?.isGithubConnected &&
                      githubStatus?.hasRepo && (
                        <div className="bg-white dark:bg-zinc-900 border border-green-200 dark:border-green-900/40 rounded-2xl shadow-sm p-6 h-full w-full flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-green-600 dark:text-green-400"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  GitHub Ready
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Your GitHub account is connected and your
                                  repository is ready.
                                </p>
                              </div>
                            </div>

                            <div className="rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 px-4 py-3">
                              <p className="text-sm text-green-700 dark:text-green-400">
                                Future review solutions will now be saved
                                automatically to your GitHub repo.
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              Authenticated
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              Repository Initialized
                            </span>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* RIGHT CARD */}
                  <div
                    className="h-full min-h-[380px]"
                    id="programmatic-navigation"
                  >
                    <div className="bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 w-full h-full flex flex-col">
                      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                        Programmatic Navigation
                      </h2>

                      <div className="space-y-4 text-base text-gray-800 dark:text-gray-200">
                        <p>
                          Dashboard →{" "}
                          <Link href="/dashboard">
                            <code className="text-blue-600 dark:text-blue-400 hover:underline">
                              /dashboard
                            </code>
                          </Link>
                        </p>

                        <p>
                          Add Problem →{" "}
                          <Link href="/problems">
                            <code className="text-blue-600 dark:text-blue-400 hover:underline">
                              /problems
                            </code>
                          </Link>
                        </p>

                        <p>
                          View Problems →{" "}
                          <Link href="/view-problems">
                            <code className="text-blue-600 dark:text-blue-400 hover:underline">
                              /view-problems
                            </code>
                          </Link>
                        </p>

                        <p>
                          Account Settings →{" "}
                          <Link href="/account-settings">
                            <code className="text-blue-600 dark:text-blue-400 hover:underline">
                              /account-settings
                            </code>
                          </Link>
                        </p>

                        <p>
                          Documentation →{" "}
                          <Link href="/docs">
                            <code className="text-blue-600 dark:text-blue-400 hover:underline">
                              /docs
                            </code>
                          </Link>
                        </p>

                        <p>
                          Update Solution →{" "}
                          <Link href="/review">
                            <code className="text-blue-600 dark:text-blue-400 hover:underline">
                              /review
                            </code>
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="space-y-6 w-full">
                  <div className="min-h-28 w-full px-4 grid place-items-center">
                    <div className="w-full rounded-2xl border border-border bg-background/70 backdrop-blur-md shadow-sm p-6 mt-10">
                      <Accordion
                        type="single"
                        collapsible
                        className="space-y-4"
                      >
                        <AccordionItem
                          value="item-1"
                          className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
                        >
                          <AccordionTrigger className="cursor-pointer px-4 py-3 text-left font-medium text-base transition hover:bg-muted">
                            How to review a problem
                          </AccordionTrigger>

                          <AccordionContent className="px-4 pb-4 pt-2 text-sm leading-relaxed text-muted-foreground">
                            When you open a problem from the View page by
                            clicking on a particular problem, you’ll see a{" "}
                            <span className="font-semibold text-foreground">
                              Review / Solve the problem
                            </span>{" "}
                            button.
                            <br />
                            <br />
                            Clicking it means you reviewed the problem, and
                            you’ll be redirected to the original platform link.
                            <br />
                            Anamnesis will then schedule the next review
                            automatically.
                            <br />
                            <br />
                            <span className="font-medium text-foreground">
                              Try this after adding your first problem.
                            </span>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
      {/* <button onClick={() => startNextStep("docs-demo")}>
        Start Demo Tour
      </button> */}
    </div>
  );
}
