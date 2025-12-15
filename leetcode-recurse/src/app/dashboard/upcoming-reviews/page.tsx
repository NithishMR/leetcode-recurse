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
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UpcomingReviews() {
  const { data, error, isLoading } = useSWR(
    "/api/dashboard/upcoming-reviews",
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 5,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading upcoming reviews...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load upcoming reviews.
      </div>
    );
  }

  const upcoming: ProblemSchema[] = data?.reviews ?? [];

  if (upcoming.length === 0) {
    return (
      <div className="p-6 text-center italic text-gray-400 dark:text-gray-500">
        No reviews scheduled in the next 7 days 🎉
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
        Upcoming Reviews (Next 7 Days)
      </h2>

      <div className="divide-y divide-gray-200 dark:divide-[#262626]">
        {upcoming.map((problem) => {
          const daysLeft = Math.ceil(
            (new Date(problem.nextReviewDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          );

          const urgencyColor =
            daysLeft <= 2
              ? "text-green-600 dark:text-green-400"
              : daysLeft <= 5
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-red-600 dark:text-red-400";

          const difficultyColor =
            problem.difficulty === "easy"
              ? "text-green-700 dark:text-green-400"
              : problem.difficulty === "medium"
              ? "text-yellow-700 dark:text-yellow-400"
              : "text-red-700 dark:text-red-400";

          return (
            <Link key={problem._id} href={`/view-problems/${problem._id}`}>
              <div
                className="
                  flex justify-between items-center
                  py-3 px-2 rounded-lg
                  transition

                  hover:bg-gray-50
                  dark:hover:bg-[#1f1f1f]
                "
              >
                {/* LEFT */}
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-[#e5e5e5]">
                    {problem.problemName}
                  </span>

                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {problem.source} •{" "}
                    <span className={difficultyColor}>
                      {problem.difficulty}
                    </span>
                  </span>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className={`font-semibold ${urgencyColor}`}>
                    {daysLeft === 0
                      ? "Today"
                      : daysLeft === 1
                      ? "1 day left"
                      : `${daysLeft} days left`}
                  </p>

                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(problem.nextReviewDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center mt-4">
        <Link href="/dashboard/upcoming-reviews">
          <Button
            variant="link"
            className="text-blue-600 dark:text-blue-400 cursor-pointer"
          >
            See all upcoming problems
          </Button>
        </Link>
      </div>
    </div>
  );
}
