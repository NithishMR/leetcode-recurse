type ProblemStatusProps = {
  nextReviewDate: string;
  timesSolved: number;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return `
        bg-green-100 text-green-700
        dark:bg-green-900/30 dark:text-green-300
      `;
    case "Due Today":
      return `
        bg-yellow-100 text-yellow-700
        dark:bg-yellow-900/30 dark:text-yellow-300
      `;
    case "Missed":
      return `
        bg-red-100 text-red-700
        dark:bg-red-900/30 dark:text-red-300
      `;
    case "Retired":
      return `
        bg-gray-200 text-gray-600
        dark:bg-gray-800 dark:text-gray-300
      `;
    default:
      return `
        bg-blue-100 text-blue-700
        dark:bg-blue-900/30 dark:text-blue-300
      `;
  }
};

const getReviewStatus = (nextDate: string, noOfTimesSolved: number) => {
  const today = new Date();
  const next = new Date(nextDate);

  if (noOfTimesSolved >= 4) return "Retired";
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
      className={`
        inline-flex items-center justify-center
        px-3 py-1 rounded-full text-sm font-semibold text-center
        border border-transparent
        dark:border-white/10
        ${color}
      `}
    >
      {status}
    </span>
  );
}
