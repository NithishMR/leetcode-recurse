"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ProblemSchema {
  _id: string;
  problemName: string;
  source: string;
  difficulty: string;
  nextReviewDate: string;
}

export default function UpcomingReviews() {
  const [upcoming, setUpcoming] = useState<ProblemSchema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await fetch("/api/dashboard/upcoming-reviews");
        if (!res.ok) throw new Error("Failed to fetch upcoming reviews");
        const { reviews } = await res.json();
        setUpcoming(reviews);
      } catch (error) {
        console.error("Error fetching upcoming reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading upcoming reviews...
      </div>
    );

  if (upcoming.length === 0)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-medium text-gray-700">
          Loading Recent Activity Details
        </p>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
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
            <div
              key={problem._id}
              className="flex justify-between items-center py-3 hover:bg-gray-50 transition-all px-2 rounded-lg"
            >
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
                  {daysLeft} {daysLeft === 1 ? "day" : "days"} left
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
          );
        })}
      </div>
    </div>
  );
}
