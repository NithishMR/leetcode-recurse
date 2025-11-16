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
const CalendarIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 7H18V19C19.1046 19 20 18.1046 20 17V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19H18M6 7V3M18 7V3M9 12H15"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16h.01" />
  </svg>
);

const ClockIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const AcademicCapIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3L2 8l10 5 10-5-10-5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 10v5.5A6.5 6.5 0 0012 22a6.5 6.5 0 006-6.5V10"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 13l8-4" />
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
        <div className="bg-white shadow-lg p-8 rounded-2xl mb-8 border">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                {problem.problemName}
              </h1>

              <p className="mt-2 text-lg text-gray-500 flex items-center">
                <img
                  src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${problem.source}.com&size=64`}
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
            className=""
            onClick={() => {
              handleReviewed();
              window.location.href = problem.problemUrl;
            }}
          >
            Solve the Problem
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<CalendarIcon className="w-6 h-6 mr-2" />}
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
            icon={<AcademicCapIcon className="w-6 h-6 mr-2" />}
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
