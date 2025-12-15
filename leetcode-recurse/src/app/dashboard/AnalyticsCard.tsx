import { useState } from "react";

interface AnalyticsCardProps {
  titleHeader: string;
  count: number;
}

export default function AnalyticsCard({
  titleHeader,
  count,
}: AnalyticsCardProps) {
  const isLoading = count === -1;

  return (
    <div
      className="
        min-w-[180px]
        rounded-2xl
        p-6
        border
        transition
        duration-200
        flex
        flex-col
        items-center
        justify-center
        text-center

        bg-white
        border-gray-200
        shadow-md
        hover:shadow-lg
        hover:bg-gray-50

        dark:bg-[#161616]
        dark:border-[#262626]
        dark:shadow-none
        dark:hover:bg-[#1f1f1f]
      "
    >
      <div
        className="
          text-sm font-medium tracking-wide
          text-gray-600
          dark:text-gray-400
        "
      >
        {titleHeader}
      </div>

      {isLoading ? (
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Loading {titleHeader} stats…
        </div>
      ) : (
        <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-[#e5e5e5]">
          {count}
        </div>
      )}
    </div>
  );
}
