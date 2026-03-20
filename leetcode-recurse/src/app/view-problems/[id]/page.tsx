"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useSWR, { mutate } from "swr";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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
    <div className="min-h-screen py-12 mt-10 bg-gray-50 dark:bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto space-y-10 px-4 relative">
        {/* HEADER */}
        <div className="bg-white p-8 rounded-2xl border shadow-lg flex justify-between items-center dark:bg-[#161616] dark:border-[#262626] dark:shadow-none">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-[#e5e5e5]">
              {problem.problemName}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <img
                src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=https://${problem.source}&size=32`}
                className="rounded-md"
                alt=""
              />
              <span className="font-medium">{problem.source}</span>
            </div>
          </div>

          <div>
            {problem.status !== "completed" && (
              <Button
                disabled={clicked}
                onClick={!clicked ? handleReviewed : undefined}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 cursor-pointer"
              >
                {clicked ? "Already clicked →" : "Solve the Problem →"}
              </Button>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
        <div className="bg-white p-8 rounded-2xl border shadow-md dark:bg-[#161616] dark:border-[#262626]">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-[#e5e5e5]">
            Notes & Observations
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {problem.notes || "No notes yet."}
          </p>
        </div>

        {/* SOLUTIONS */}
        <div className="bg-white p-8 rounded-2xl border shadow-md dark:bg-[#161616] dark:border-[#262626]">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-[#e5e5e5]">
            Your Solutions
          </h2>

          {loadingSolutions ? (
            <p className="text-gray-500">Loading solutions...</p>
          ) : solutions.length === 0 ? (
            <p className="text-gray-500">No solutions yet.</p>
          ) : (
            <div className="space-y-4">
              {solutions.map((sol: any) => (
                <div
                  key={sol.review}
                  className="border rounded-lg p-4 dark:border-[#333]"
                >
                  <button
                    onClick={() => toggleSolution(sol.review)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {visibleSolutions[sol.review]
                      ? `Hide Solution Review ${sol.review}`
                      : `Show Solution Review ${sol.review}`}
                  </button>

                  {visibleSolutions[sol.review] && (
                    // <pre className="mt-4 bg-black text-green-400 p-4 rounded overflow-x-auto text-sm">
                    //   <code>{sol.code}</code>
                    // </pre>
                    <SyntaxHighlighter
                      language={sol.language}
                      style={oneDark}
                      className="mt-4 rounded text-sm"
                    >
                      {sol.code}
                    </SyntaxHighlighter>
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
    <div className="bg-white p-6 rounded-xl border shadow-md hover:shadow-xl dark:bg-[#161616] dark:border-[#262626]">
      <div className="flex flex-col items-center gap-2">
        <Icon />
        <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-[#e5e5e5]">
          {value}
        </p>
      </div>
    </div>
  );
}
