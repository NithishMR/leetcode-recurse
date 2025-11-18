"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Consistent date formatter (SSR + client safe)
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "—"; // handle null or undefined

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—"; // handle invalid date

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const difficultyColors: any = {
  easy: "bg-green-50 text-green-700 border-green-300",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-300",
  hard: "bg-red-50 text-red-700 border-red-300",
};

// Icons (unchanged)
export const CalendarIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-6 h-6 mr-2"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
  </svg>
);

export const ClockIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-6 h-6 mr-2"
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="7" x2="12" y2="12" />
    <line x1="12" y1="12" x2="16" y2="14" />
  </svg>
);

export const ReviewCountIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-6 h-6 mr-2"
  >
    <path
      d="M3 12a9 9 0 1 1 9 9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="3 12 3 18 9 18"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ProblemDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleReviewed = async () => {
    try {
      const res = await fetch(`/api/problems/review/${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Review failed");

      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/problems/details/${id}`);
        const data = await res.json();
        setProblem(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); //  no artificial delay
      }
    }
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Loading…</p>
      </div>
    );

  if (!problem)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-500">Problem not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white shadow-lg p-8 rounded-2xl mb-8 border flex justify-between">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-col justify-around">
              <h1 className="text-4xl font-extrabold text-gray-900 font-mono">
                {problem.problemName}
              </h1>

              <p className="mt-6 text-lg text-gray-500 flex items-center">
                <img
                  src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${problem.source}.com&size=32`}
                  alt="source icon"
                />
                <span className="font-semibold ml-1 text-gray-700">
                  {problem.source}
                </span>
              </p>
            </div>
          </div>
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={() => {
              handleReviewed();
              window.location.href = problem.problemUrl;
            }}
          >
            Solve the Problem
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 justify-between sm:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<CalendarIcon className="w-6 h-6 mr-5 " />}
            label="Solved On"
            value={formatDate(problem.dateSolved)}
            color="text-blue-600"
          />

          <StatCard
            icon={<ClockIcon className="w-6 h-6 mr-2" />}
            label="Next Review"
            value={formatDate(problem.nextReviewDate)}
            color="text-orange-600"
          />

          <StatCard
            icon={<ReviewCountIcon className="w-6 h-6 mr-2" />}
            label="Times Reviewed"
            value={problem.timesSolved}
            color="text-purple-600"
          />
        </div>

        {/* Notes */}
        <div className="bg-white p-8 shadow-lg rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            Notes & Observations
          </h2>
          <p className="text-lg text-gray-700 whitespace-pre-line">
            {problem.notes || "No notes added for this problem yet."}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 shadow-md rounded-xl border hover:shadow-lg transition">
      <div className={`flex items-center justify-center mb-3 ${color}`}>
        {icon}
        <p className="text-sm uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-2xl font-bold text-center">{value}</p>
    </div>
  );
}
