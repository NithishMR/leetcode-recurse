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
    fetcher
  );

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading upcoming reviews...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load upcoming reviews.
      </div>
    );

  const upcoming: ProblemSchema[] = data?.reviews ?? [];

  if (upcoming.length === 0)
    return (
      <div className="p-6 text-center text-gray-400 italic">
        No reviews scheduled in the next 7 days 🎉
      </div>
    );

  return (
    <div className=" bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Upcoming Reviews (Next 7 Days)
      </h2>

      <div className="divide-y divide-gray-200">
        {upcoming.map((problem) => {
          const daysLeft = Math.ceil(
            (new Date(problem.nextReviewDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          );

          const getColor = () => {
            if (daysLeft <= 2) return "text-green-600";
            if (daysLeft <= 5) return "text-yellow-600";
            return "text-red-600";
          };

          return (
            <Link key={problem._id} href={`/view-problems/${problem._id}`}>
              <div className="flex justify-between items-center py-3 hover:bg-gray-50 transition-all px-2 rounded-lg">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {problem.problemName}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {problem.source} •
                    <span
                      className={
                        problem.difficulty === "easy"
                          ? "text-green-700"
                          : problem.difficulty === "medium"
                          ? "text-yellow-700"
                          : "text-red-700"
                      }
                    >
                      {" "}
                      {problem.difficulty}
                    </span>
                  </span>
                </div>

                <div className="text-right">
                  <p className={`font-semibold ${getColor()}`}>
                    {daysLeft === 0
                      ? "Today"
                      : daysLeft === 1
                      ? "1 day left"
                      : `${daysLeft} days left`}
                  </p>
                  <p className="text-xs text-gray-400">
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
    </div>
  );
}
