"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Updated color scheme for a vibrant, distinct, and high-contrast look
const difficultyColors: any = {
  easy: "bg-green-50 text-green-700 border-green-300",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-300",
  hard: "bg-red-50 text-red-700 border-red-300",
};

// --- Custom SVG Icons (Pure HTML/Tailwind) ---

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
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.26 10.147l6-3.899 6 3.899M6 18h12M9 20V8.188a3.1 3.1 0 0 1 3-3.088c1.674 0 3 1.408 3 3.088V20M6 18v2M18 18v2M12 16v-2.188a3 3 0 0 1 3-3c1.674 0 3 1.408 3 3.088V16"
    />
  </svg>
);

const BookOpenIcon = (props: any) => (
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
      d="M12 6.75A.75.75 0 0 1 12.75 7.5v2.25H15a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0v-2.25H9a.75.75 0 0 1 0-1.5h2.25V7.5A.75.75 0 0 1 12 6.75ZM9 17.25h6"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 4.5a1.5 1.5 0 0 0-1.5 1.5V18a.75.75 0 0 0 1.5 0v-11.25H15a.75.75 0 0 0 .75-.75V6a1.5 1.5 0 0 0-1.5-1.5H9Z"
    />
  </svg>
);

// ---------------------------------------------

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`/api/problems/details/${id}`);
        if (!res.ok) throw new Error("Problem fetch failed");
        const data = await res.json();
        setProblem(data);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setProblem(null);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchProblem();
  }, [id]);

  // Loading/Error states
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-medium text-gray-700">
          Loading problem details...
        </p>
      </div>
    );
  if (!problem)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-medium text-red-500">
          Problem not found or an error occurred.
        </p>
      </div>
    );

  return (
    // General container for a clean look
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ## Problem Header Card 🏆 */}
        <div className="bg-white shadow-lg p-8 rounded-2xl mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Title and Source */}
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                {problem.problemName}
              </h1>
              <p className="mt-2 text-lg text-gray-500 flex items-center">
                <img
                  src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${problem.source}.com&size=24`}
                  alt="source icon"
                />
                <span className="font-semibold ml-1 text-gray-700">
                  {problem.source}
                </span>
              </p>
            </div>

            {/* Difficulty Badge */}
            <span
              className={`px-4 py-1.5 border-2 rounded-full text-base font-bold uppercase tracking-wider min-w-[120px] text-center ${
                difficultyColors[problem.difficulty] ||
                "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          {/* Open Problem Button */}
          <button
            onClick={() =>
              window.open(problem.problemUrl, "_blank", "noopener,noreferrer")
            }
            className="
    mt-6 inline-flex items-center gap-2
    bg-gray-900 hover:bg-black
    text-white font-semibold
    px-5 py-3
    rounded-xl
    transition-all duration-200
    shadow-sm hover:shadow
    focus:outline-none focus:ring-4 focus:ring-gray-300
  "
          >
            <span>Open Problem</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>

        {/* --- */}

        {/* ## Review Stats Grid 📊 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Solved On Card */}
          <div className="bg-white p-6 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-center mb-3 text-blue-600">
              <CalendarIcon className="w-6 h-6 mr-2" />
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                Solved On
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900 text-center">
              {new Date(problem.dateSolved).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Next Review Card */}
          <div className="bg-white p-6 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-center mb-3 text-orange-600">
              <ClockIcon className="w-6 h-6 mr-2" />
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                Next Review
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900 text-center">
              {new Date(problem.nextReviewDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Times Reviewed Card */}
          <div className="bg-white p-6 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-center mb-3 text-purple-600">
              <AcademicCapIcon className="w-6 h-6 mr-2" />
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                Times Reviewed
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900 text-center">
              {problem.timesSolved || 0}
            </p>
          </div>
        </div>

        {/* --- */}

        {/* ## Notes Section 📝 */}
        <div className="bg-white p-8 shadow-lg rounded-2xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            Notes & Observations
          </h2>
          <div className="max-w-none text-lg text-gray-700">
            <p className="leading-relaxed whitespace-pre-line">
              {problem.notes ||
                "No detailed notes or observations have been added for this problem yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
