"use client";

type ProblemStatusProps = {
  nextReviewDate: string;
  timesSolved: number;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Due Today":
      return "bg-yellow-100 text-yellow-700";
    case "Missed":
      return "bg-red-100 text-red-700";
    case "Retired":
      return "bg-gray-200 text-gray-600";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

const getReviewStatus = (nextDate: string, noOfTimesSolved: number) => {
  const today = new Date();
  const next = new Date(nextDate);
  if (noOfTimesSolved >= 7) return "Retired";
  if (next > today) return "Active";
  if (next.toDateString() === today.toDateString()) return "Due Today";
  return "Missed";
};

export default function ProblemStatus({
  nextReviewDate,
  timesSolved,
}: ProblemStatusProps) {
  const status = getReviewStatus(nextReviewDate, timesSolved);
  const color = getStatusColor(status);

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold text-center ${color}`}
    >
      {status}
    </span>
  );
}
