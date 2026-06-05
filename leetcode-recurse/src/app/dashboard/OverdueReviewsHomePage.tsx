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
  daysOverdue: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OverdueReviewsHomePage() {
  const { data, error } = useSWR("/api/problems/overdue", fetcher, {
    suspense: true,
    dedupingInterval: 1000 * 60 * 5,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load overdue reviews.
      </div>
    );
  }

  const overdue: ProblemSchema[] = data?.reviews ?? [];

  if (overdue.length === 0) {
    return (
      <div className="p-6 text-center italic text-gray-400 dark:text-gray-500">
        No overdue reviews 🎉
      </div>
    );
  }

  return (
    <div
      className="
        bg-white p-6 rounded-2xl border shadow-md
        dark:bg-[#161616]
        dark:border-[#262626]
        dark:shadow-none
      "
    >
      <div className="divide-y divide-gray-200 dark:divide-[#262626]">
        {overdue.map((problem) => {
          const getOverdueColor = () => {
            if (problem.daysOverdue <= 3)
              return "text-yellow-600 dark:text-yellow-400";

            if (problem.daysOverdue <= 7)
              return "text-orange-600 dark:text-orange-400";

            return "text-red-600 dark:text-red-400";
          };

          return (
            <Link key={problem._id} href={`/view-problems/${problem._id}`}>
              <div
                className="
                  flex justify-between items-center
                  py-3 px-2 rounded-lg
                  transition-all

                  hover:bg-red-50
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
                    <span
                      className={
                        problem.difficulty === "easy"
                          ? "text-green-700 dark:text-green-400"
                          : problem.difficulty === "medium"
                            ? "text-yellow-700 dark:text-yellow-400"
                            : "text-red-700 dark:text-red-400"
                      }
                    >
                      {problem.difficulty}
                    </span>
                  </span>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className={`font-semibold ${getOverdueColor()}`}>
                    {problem.daysOverdue === 1
                      ? "1 day overdue"
                      : `${problem.daysOverdue} days overdue`}
                  </p>

                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Due{" "}
                    {new Date(problem.nextReviewDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* <div className="flex justify-center mt-4">
        <Link href="/dashboard/overdue-reviews">
          <Button
            variant="link"
            className="text-red-600 dark:text-red-400 cursor-pointer"
          >
            See all overdue problems
          </Button>
        </Link>
      </div> */}
    </div>
  );
}
