"use client";

import useSWR from "swr";
import {
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from "recharts";

type WeeklyData = {
  weekLabel: string;
  solved: number;
  pending: number;
};

interface CustomBarChartProps {
  isAnimationActive?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CustomBarChart({
  isAnimationActive = true,
}: CustomBarChartProps) {
  const { data, error, isLoading } = useSWR(
    "/api/dashboard/weekly-progress",
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 5,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading progress over time...
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load progress over time.
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <div
      className="
        bg-white p-6 rounded-2xl border shadow-md
        hover:shadow-lg hover:bg-gray-50 transition

        dark:bg-[#161616]
        dark:border-[#262626]
        dark:shadow-none
        dark:hover:bg-[#1f1f1f]
      "
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-[#e5e5e5]">
        Weekly Problem Progress
      </h2>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              className="dark:stroke-[#262626]"
            />

            {/* Axes */}
            <XAxis
              dataKey="weekLabel"
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: "#D1D5DB" }}
              tickLine={{ stroke: "#D1D5DB" }}
            />

            <YAxis
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: "#D1D5DB" }}
              tickLine={{ stroke: "#D1D5DB" }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#161616",
                border: "1px solid #262626",
                color: "#e5e5e5",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#cbd5e1" }}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />

            {/* Legend */}
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ color: "#9ca3af" }}
            />

            {/* Bars */}
            <Bar
              dataKey="solved"
              name="Solved"
              fill="#22C55E"
              radius={[6, 6, 0, 0]}
              isAnimationActive={isAnimationActive}
            />

            <Bar
              dataKey="pending"
              name="Pending"
              fill="#F59E0B"
              radius={[6, 6, 0, 0]}
              isAnimationActive={isAnimationActive}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
