"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSWR from "swr";

interface ProblemSchema {
  _id: string;
  problemName: string;
  source: string;
  difficulty: string;
  nextReviewDate: string;
  timesSolved: number;
  reviewStage: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UpcomingReviews() {
  const { data, error, isLoading } = useSWR(
    "/api/problems/solutions/",
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 5,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading problems to solve...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load problems.
      </div>
    );
  }

  const upcoming: ProblemSchema[] = data?.reviews ?? [];

  if (upcoming.length === 0) {
    return (
      <div className="p-6 text-center italic text-gray-400 dark:text-gray-500 mt-36">
        No problems to solve today 🎉
      </div>
    );
  }

  return (
    <div
      className="
        mt-26
        bg-white p-6 rounded-2xl border shadow-md
        dark:bg-[#161616]
        dark:border-[#262626]
        dark:shadow-none
      "
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-[#e5e5e5]">
        Problems to Solve Today
      </h2>

      <div className="divide-y divide-gray-200 dark:divide-[#262626]">
        {upcoming.map((problem) => {
          const daysDiff = Math.floor(
            (new Date(problem.nextReviewDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          );

          const isOverdue = daysDiff < 0;
          const isToday = daysDiff === 0;

          const difficultyColor =
            problem.difficulty === "easy"
              ? "text-green-700 dark:text-green-400"
              : problem.difficulty === "medium"
                ? "text-yellow-700 dark:text-yellow-400"
                : "text-red-700 dark:text-red-400";

          const badgeStyle = isOverdue
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            : isToday
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

          return (
            <div
              key={problem._id}
              className="
                flex justify-between items-center
                py-4 px-2 rounded-lg
                transition
                hover:bg-gray-50
                dark:hover:bg-[#1f1f1f]
              "
            >
              {/* LEFT */}
              <div className="flex flex-col gap-1">
                <Link href={`/view-problems/${problem._id}`}>
                  <span className="font-medium text-gray-900 dark:text-[#e5e5e5] hover:underline cursor-pointer">
                    {problem.problemName}
                  </span>
                </Link>

                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {problem.source} •{" "}
                  <span className={difficultyColor}>{problem.difficulty}</span>
                </span>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {problem.reviewStage}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${badgeStyle}`}
                  >
                    {isOverdue ? "Overdue" : isToday ? "Due Today" : "Upcoming"}
                  </span>
                </div>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <Link href={`/review/${problem._id}`}>
                  <Button variant="link" className="cursor-pointer">
                    Update Solution
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
