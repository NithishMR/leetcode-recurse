"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
export const CalendarIcon = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    className="w-6 h-6"
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
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    className="w-6 h-6"
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="7" x2="12" y2="12" />
    <line x1="12" y1="12" x2="16" y2="14" />
  </svg>
);

export const ReviewCountIcon = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    className="w-6 h-6"
  >
    <path d="M3 12a9 9 0 1 1 9 9" strokeLinecap="round" />
    <polyline points="3 12 3 18 9 18" strokeLinecap="round" />
  </svg>
);

export default function ProblemDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleReviewed = async () => {
    try {
      await fetch(`/api/problems/review/${id}`, { method: "POST" });
      window.location.href = problem.problemUrl;
      router.refresh();
    } catch {}
  };

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/problems/details/${id}`);
      const data = await res.json();
      setProblem(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto space-y-10 px-4">
        {/* HEADER */}
        <div className="bg-white p-8 shadow-lg rounded-2xl border flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {problem.problemName}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-gray-600">
              <img
                title=""
                alt=""
                src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=http://${problem.source}.com&size=32`}
                className="rounded-md"
              />
              <span className="font-medium">{problem.source}</span>
            </div>
          </div>

          <Button
            variant="default"
            className="px-5 py-3 text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={handleReviewed}
          >
            Solve the Problem →
          </Button>
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
        <div className="bg-white p-8 shadow-md rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">Notes & Observations</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {problem.notes || "No notes yet."}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white p-6 shadow-md rounded-xl border hover:shadow-xl transition">
      <div className="flex flex-col items-center gap-2">
        <Icon />
        <p className="text-sm text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
