"use client";
import { useEffect, useState } from "react";
import CustomPieChart from "./CustomPieChart";

export default function DifficultyDistribution() {
  const [loading, setLoading] = useState(true);
  const [difficultyData, setDifficultyData] = useState([
    { name: "Easy", value: 0 },
    { name: "Medium", value: 0 },
    { name: "Hard", value: 0 },
  ]);

  useEffect(() => {
    async function fetchDifficultyStats() {
      const res = await fetch("/api/dashboard/difficulty-distribution");
      const data = await res.json();

      setDifficultyData([
        { name: "Easy", value: data.easy },
        { name: "Medium", value: data.medium },
        { name: "Hard", value: data.hard },
      ]);
      setLoading(false);
    }

    fetchDifficultyStats();
  }, []);
  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading Difficulty distribution...
      </div>
    );
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold mt-4">
        Difficulty Distribution
      </h1>

      <div className="flex justify-center mt-6 p-10">
        <CustomPieChart data={difficultyData} />
      </div>
    </div>
  );
}
