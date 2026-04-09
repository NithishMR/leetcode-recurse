"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR, { mutate } from "swr";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ProblemDifficultyStatus from "../ProblemDifficultyStatus";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// --- Icons ---
const CalendarIcon = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    className="w-6 h-6 text-gray-600 dark:text-gray-300"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
  </svg>
);

const ClockIcon = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    className="w-6 h-6 text-gray-600 dark:text-gray-300"
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="7" x2="12" y2="12" />
    <line x1="12" y1="12" x2="16" y2="14" />
  </svg>
);

const ReviewCountIcon = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    className="w-6 h-6 text-gray-600 dark:text-gray-300"
  >
    <path d="M3 12a9 9 0 1 1 9 9" strokeLinecap="round" />
    <polyline points="3 12 3 18 9 18" strokeLinecap="round" />
  </svg>
);

export default function ProblemDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [clicked, setClicked] = useState(false);
  const [visibleSolutions, setVisibleSolutions] = useState<
    Record<number, boolean>
  >({});

  // ==========================
  // 🔹 PROBLEM FETCH (CACHED)
  // ==========================
  const { data: problem, isLoading } = useSWR(
    id ? `/api/problems/details/${id}` : null,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 5,
      revalidateOnFocus: false,
    },
  );

  // ==========================
  // 🔹 SOLUTIONS FETCH (CACHED)
  // ==========================
  const safeProblemName = problem?.problemName
    ?.toLowerCase()
    .replace(/\s+/g, "-");

  const { data: solutions = [], isLoading: loadingSolutions } = useSWR(
    safeProblemName
      ? `/api/github/get-solutions?problemName=${safeProblemName}`
      : null,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 5,
      revalidateOnFocus: false,
    },
  );

  // ==========================
  // 🔹 REVIEW HANDLER
  // ==========================
  const handleReviewed = async () => {
    setClicked(true);
    try {
      await fetch(`/api/problems/review/${id}`, { method: "POST" });

      mutate(`/api/problems/details/${id}`);
      mutate("/api/dashboard/summary");
      mutate("/api/dashboard/weekly-progress");
      mutate("/api/dashboard/upcoming-reviews");
      mutate("/api/dashboard/recent-activity");

      window.location.href = problem.problemUrl;
      router.refresh();
    } catch {}
  };

  // ==========================
  // 🔹 TOGGLE SOLUTION
  // ==========================
  const toggleSolution = (review: number) => {
    setVisibleSolutions((prev) => ({
      ...prev,
      [review]: !prev[review],
    }));
  };

  return (
    <div className="min-h-screen mt-10 bg-gray-50 py-10 dark:bg-[#0d0d0d]">
      <div className="relative mx-auto max-w-5xl space-y-8 px-4">
        {/* HEADER */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-[#262626] dark:bg-[#161616]">
          {isLoading ? (
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-5 w-full">
                <div className="flex gap-3">
                  <Skeleton className="h-7 w-[90px] rounded-full" />
                  <Skeleton className="h-7 w-[100px] rounded-full" />
                </div>

                <div className="space-y-3">
                  <Skeleton className="h-10 w-[70%]" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded-md" />
                    <Skeleton className="h-5 w-[140px]" />
                  </div>
                </div>
              </div>

              <Skeleton className="h-14 w-[220px] rounded-xl" />
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    <ProblemDifficultyStatus difficulty={problem.difficulty} />
                  </span>

                  {problem.status === "completed" && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Completed
                    </span>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-[#f3f3f3] md:text-4xl">
                    {problem.problemName}
                  </h1>

                  <div className="mt-4 flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <img
                      src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=https://${problem.source}&size=32`}
                      className="h-6 w-6 rounded-md"
                      alt=""
                    />
                    <span className="font-medium capitalize">
                      {problem.source}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                {problem.status !== "completed" ? (
                  <Button
                    disabled={clicked}
                    onClick={!clicked ? handleReviewed : undefined}
                    className="w-full cursor-pointer rounded-xl bg-blue-600 px-6 py-6 text-base text-white hover:bg-blue-700 disabled:opacity-50 md:w-auto"
                  >
                    {clicked ? "Already clicked →" : "Solve the Problem →"}
                  </Button>
                ) : (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400">
                    Review cycle completed
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#161616]"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-[120px]" />
                </div>
              </div>
            ))
          ) : (
            <>
              <StatCard
                label="Solved On"
                value={formatDate(problem.dateSolved)}
                icon={CalendarIcon}
              />
              <StatCard
                label="Next Review"
                value={formatDate(problem.nextReviewDate)}
                icon={ClockIcon}
              />
              <StatCard
                label="Times Reviewed"
                value={problem.timesSolved}
                icon={ReviewCountIcon}
              />
            </>
          )}
        </div>

        {/* NOTES */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-[#262626] dark:bg-[#161616]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#f3f3f3]">
              Notes & Observations
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-[#222] dark:bg-[#111111]">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[88%]" />
                <Skeleton className="h-4 w-[76%]" />
              </div>
            ) : (
              <p className="whitespace-pre-line leading-7 text-gray-700 dark:text-gray-300">
                {problem.notes || "No notes yet."}
              </p>
            )}
          </div>
        </div>

        {/* SOLUTIONS */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-[#262626] dark:bg-[#161616]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#f3f3f3]">
              Your Solutions
            </h2>

            {isLoading ? (
              <Skeleton className="h-4 w-[120px]" />
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {solutions.length} saved review
                {solutions.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loadingSolutions || isLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-zinc-50 dark:border-[#2a2a2a] dark:bg-[#111111]"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#222]">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-[90px]" />
                      <Skeleton className="h-6 w-[70px] rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-[180px] w-full rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : solutions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-500 dark:border-[#333] dark:text-gray-400">
              No saved solutions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {solutions.map((sol: any) => (
                <div
                  key={sol.review}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-zinc-50 dark:border-[#2a2a2a] dark:bg-[#111111]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-[#222]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Review {sol.review}
                      </span>

                      <span className="rounded-full bg-zinc-200 px-2.5 py-1 text-xs uppercase text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {sol.language}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSolution(sol.review)}
                      className="cursor-pointer text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {visibleSolutions[sol.review] ? "Hide Code" : "Show Code"}
                    </button>
                  </div>

                  {visibleSolutions[sol.review] && (
                    <div className="p-4">
                      <SyntaxHighlighter
                        language={sol.language}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          borderRadius: "1rem",
                          background: "#0b0f17",
                        }}
                      >
                        {sol.code}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-[#262626] dark:bg-[#161616]">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <Icon className="h-5 w-5" />
        </div>

        <p className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
          {label}
        </p>

        <p className="text-2xl font-bold text-gray-900 dark:text-[#f3f3f3]">
          {value}
        </p>
      </div>
    </div>
  );
}
