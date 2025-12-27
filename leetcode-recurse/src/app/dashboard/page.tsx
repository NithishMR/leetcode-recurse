"use client";
import useSWR from "swr";
import AnalyticsCard from "./AnalyticsCard";
import ProgressOverTime from "./ProgressOverTime";
import RecentActivityLog from "./RecentActivityLog";
import UpcomingReviews from "./UpcomingReviews";
import DifficyltyDistribution from "./DifficultyDistribution";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data, error, isLoading } = useSWR("/api/dashboard/summary", fetcher, {
    dedupingInterval: 1000 * 60 * 5, // 5 mins cache
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-black">
        <p className="text-xl font-medium text-gray-700 dark:text-white">
          Loading problem ...
        </p>
      </div>
    );
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 ">
        <div
          className="bg-white rounded-2xl shadow-md p-6 border border-gray-200
        hover:shadow-lg
        hover:bg-gray-50
        dark:bg-[#161616]
        dark:border-[#262626]
        dark:shadow-none
        dark:hover:bg-[#1f1f1f]"
        >
          <h2 className="text-lg font-semibold mb-4">
            Difficulty Distribution
          </h2>
          <DifficyltyDistribution />
        </div>

        <div
          className="rounded-2xl  p-6 border 
        shadow-md
        hover:shadow-lg
        hover:bg-gray-50

        dark:bg-[#161616]
        dark:border-[#262626]
        dark:shadow-none
        dark:hover:bg-[#1f1f1f]"
        >
          <h2 className="text-lg font-semibold mb-4">Progress Over Time</h2>
          <ProgressOverTime />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div
          className=" rounded-2xl  p-6 border bg-white
        border-gray-200
        shadow-md
        hover:shadow-lg
        hover:bg-gray-50

        dark:bg-[#161616]
        dark:border-[#262626]
        dark:shadow-none
        dark:hover:bg-[#1f1f1f]"
        >
          {/* <h2 className="text-lg font-semibold mb-4">Upcoming Reviews</h2> */}
          <UpcomingReviews />
        </div>

        <div
          className=" rounded-2xl  p-6 border bg-white
        border-gray-200
        shadow-md
        hover:shadow-lg
        hover:bg-gray-50

        dark:bg-[#161616]
        dark:border-[#262626]
        dark:shadow-none
        dark:hover:bg-[#1f1f1f]"
        >
          {/* <h2 className="text-lg font-semibold mb-4">Recent Activity</h2> */}
          <RecentActivityLog />
        </div>
      </div>
    </div>
  );
}
