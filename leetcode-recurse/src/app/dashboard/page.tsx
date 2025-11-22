// "use client";
// import { useEffect, useState } from "react";
// import AnalyticsCard from "./AnalyticsCard";
// import ProgressOverTime from "./ProgressOverTime";
// import RecentActivityLog from "./RecentActivityLog";
// import UpcomingReviews from "./UpcomingReviews";
// import DifficyltyDistribution from "./DifficultyDistribution";

// export default function DashBoard() {
//   const [problemCount, setProblemCount] = useState<number>(-1);
//   const [reviewedToday, setReviewedToday] = useState(-1);
//   const [pendingToday, setPendingToday] = useState(-1);
//   const [overdue, setOverdue] = useState(-1);

//   const handleProblemCount = async () => {
//     const response = await fetch("/api/dashboard/problem-count");
//     const data = await response.json();
//     setProblemCount(data.problemCount);
//   };
//   const handleReviewedToday = async () => {
//     const response = await fetch("/api/dashboard/reviewed-today");
//     const data = await response.json();

//     setReviewedToday(data.reviewedToday);
//   };
//   const handlePendingProblems = async () => {
//     const response = await fetch("/api/dashboard/pending");
//     const data = await response.json();
//     setPendingToday(data.pendingToday);
//   };
//   const handleReviewOverDue = async () => {
//     const response = await fetch("/api/dashboard/overdue");
//     const data = await response.json();
//     setOverdue(data.overdue);
//   };
//   useEffect(() => {
//     handleProblemCount();
//     handleReviewedToday();
//     handlePendingProblems();
//     handleReviewOverDue();
//   }, []);
//   return (
//     <div className="px-6 py-8">
//       {/* TITLE */}
//       <h1 className="text-center text-3xl font-bold tracking-tight mb-10">
//         Your Progress & Analytics
//       </h1>

//       {/* ANALYTICS CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <AnalyticsCard titleHeader="Total Problems" count={problemCount} />
//         <AnalyticsCard titleHeader="Reviewed Today" count={reviewedToday} />
//         <AnalyticsCard titleHeader="Pending Problems" count={pendingToday} />
//         <AnalyticsCard titleHeader="Review Overdue" count={overdue} />
//       </div>

//       {/* CHARTS SECTION */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
//         <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Difficulty Distribution
//           </h2>
//           <DifficyltyDistribution />
//         </div>

//         <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Progress Over Time
//           </h2>
//           <ProgressOverTime />
//         </div>
//       </div>

//       {/* UPCOMING REVIEWS + RECENT ACTIVITY */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
//         <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Upcoming Reviews
//           </h2>
//           <UpcomingReviews />
//         </div>

//         <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Recent Activity
//           </h2>
//           <RecentActivityLog />
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import useSWR from "swr";
import AnalyticsCard from "./AnalyticsCard";
import ProgressOverTime from "./ProgressOverTime";
import RecentActivityLog from "./RecentActivityLog";
import UpcomingReviews from "./UpcomingReviews";
import DifficyltyDistribution from "./DifficultyDistribution";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data, error, isLoading } = useSWR("/api/dashboard/summary", fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-medium text-gray-700">
          Loading dashboard ...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load dashboard.
      </p>
    );
  }

  const { problemCount, reviewedToday, pendingToday, overdue } = data;

  return (
    <div className="px-6 py-8 mt-10">
      <h1 className="text-center text-3xl font-bold tracking-tight mb-10">
        Your Progress & Analytics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard titleHeader="Total Problems" count={problemCount} />
        <AnalyticsCard titleHeader="Reviewed Today" count={reviewedToday} />
        <AnalyticsCard titleHeader="Pending Problems" count={pendingToday} />
        <AnalyticsCard titleHeader="Review Overdue" count={overdue} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Difficulty Distribution
          </h2>
          <DifficyltyDistribution />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Progress Over Time</h2>
          <ProgressOverTime />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Upcoming Reviews</h2>
          <UpcomingReviews />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <RecentActivityLog />
        </div>
      </div>
    </div>
  );
}
