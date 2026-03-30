"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useSWR, { mutate } from "swr";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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
      dedupingInterval: 1000 * 60 * 5, // 5 min cache
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
      dedupingInterval: 1000 * 60 * 5, // cache GitHub calls
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

      // 🔥 refresh cached problem data
      mutate(`/api/problems/details/${id}`);

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

  if (isLoading || !problem) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-[#0d0d0d]">
        <p className="text-xl text-gray-600 dark:text-gray-300">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 mt-10 bg-gray-50 dark:bg-[#0d0d0d]">
      <div className="max-w-5xl mx-auto space-y-8 px-4 relative">
        {/* HEADER */}
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#262626] rounded-3xl shadow-sm p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="">
                <ProblemDifficultyStatus difficulty={problem.difficulty} />
              </span>

              {problem.status === "completed" && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Completed
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-[#f3f3f3]">
                {problem.problemName}
              </h1>

              <div className="mt-4 flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <img
                  src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=https://${problem.source}&size=32`}
                  className="rounded-md w-6 h-6"
                  alt=""
                />
                <span className="font-medium capitalize">{problem.source}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto">
            {problem.status !== "completed" ? (
              <Button
                disabled={clicked}
                onClick={!clicked ? handleReviewed : undefined}
                className="w-full md:w-auto px-6 py-6 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 cursor-pointer"
              >
                {clicked ? "Already clicked →" : "Solve the Problem →"}
              </Button>
            ) : (
              <div className="px-4 py-3 rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-sm font-medium">
                Review cycle completed
              </div>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
        </div>

        {/* NOTES */}
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#262626] rounded-3xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#f3f3f3]">
              Notes & Observations
            </h2>
          </div>

          <div className="rounded-2xl bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-[#222] p-5">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-7">
              {problem.notes || "No notes yet."}
            </p>
          </div>
        </div>

        {/* SOLUTIONS */}
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#262626] rounded-3xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#f3f3f3]">
              Your Solutions
            </h2>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              {solutions.length} saved review{solutions.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loadingSolutions ? (
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-[#333] p-6 text-gray-500 dark:text-gray-400 text-center">
              Loading solutions...
            </div>
          ) : solutions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-[#333] p-6 text-gray-500 dark:text-gray-400 text-center">
              No saved solutions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {solutions.map((sol: any) => (
                <div
                  key={sol.review}
                  className="border border-gray-200 dark:border-[#2a2a2a] rounded-2xl overflow-hidden bg-zinc-50 dark:bg-[#111111]"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-[#222]">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Review {sol.review}
                      </span>

                      <span className="px-2.5 py-1 text-xs rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 uppercase">
                        {sol.language}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSolution(sol.review)}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {visibleSolutions[sol.review] ? "Hide Code" : "Show Code"}
                    </button>
                  </div>

                  {visibleSolutions[sol.review] && (
                    <div className="p-4">
                      <SyntaxHighlighter
                        language={sol.language}
                        style={oneDark}
                        className=" bg-[#0b0f17]"
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
    <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#262626] rounded-2xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <Icon className="w-5 h-5" />
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
