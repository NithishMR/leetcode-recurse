"use client";

import CustomPieChart from "./CustomPieChart";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DifficultyDistribution() {
  const { data, error, isLoading } = useSWR(
    "/api/dashboard/difficulty-distribution",
    fetcher
  );

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading difficulty distribution...
      </div>
    );

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">Failed to load progress.</p>
    );
  }

  if (!data || (data.easy === 0 && data.medium === 0 && data.hard === 0)) {
    return (
      <p className="text-center text-gray-500">No activity recorded yet.</p>
    );
  }

  return (
    <div className="flex justify-center mt-6 p-10">
      <CustomPieChart
        data={[
          { name: "Easy", value: data.easy },
          { name: "Medium", value: data.medium },
          { name: "Hard", value: data.hard },
        ]}
      />
    </div>
  );
}
