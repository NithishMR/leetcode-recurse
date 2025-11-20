"use client";
import useSWR from "swr";
import { useState, useEffect } from "react";
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
  // const [data, setData] = useState<WeeklyData[]>([]);
  // const [loading, setLoading] = useState(true);
  // Fetch from backend API (replace with your route)
  const { data, error, isLoading } = useSWR(
    "/api/dashboard/weekly-progress",
    fetcher
  );

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading progress over time...
      </div>
    );
  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load progress over time.
      </p>
    );
  }
  if (data?.length === 0) {
    return (
      <p className="text-center text-gray-500">No activity recorded yet.</p>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Weekly Problem Progress
      </h2>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="weekLabel" tick={{ fill: "#6B7280" }} />
            <YAxis tick={{ fill: "#6B7280" }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="solved"
              fill="#22C55E"
              name="Solved"
              isAnimationActive={isAnimationActive}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="pending"
              fill="#F59E0B"
              name="Pending"
              isAnimationActive={isAnimationActive}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
