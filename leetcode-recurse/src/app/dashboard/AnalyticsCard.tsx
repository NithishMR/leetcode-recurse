import { useState } from "react";

interface AnalyticsCardType {
  titleHeader: string;
  count: number;
}

export default function AnalyticsCard({
  titleHeader,
  count,
}: {
  titleHeader: string;
  count: number;
}) {
  if (count == -1) {
    return (
      <div
        className="
      min-w-[180px]
      bg-white 
      rounded-2xl 
      shadow-md 
      p-6 
      border 
      border-gray-200
      hover:shadow-lg 
      hover:bg-gray-50
      transition 
      duration-200
      flex 
      flex-col 
      items-center
      justify-center
      text-center
    "
      >
        <div className="text-gray-600 text-sm font-medium tracking-wide">
          {titleHeader}
        </div>
        <div className="mt-3 text-sm  text-gray-500">
          Loading {titleHeader} stats .....
        </div>
      </div>
    );
  }
  return (
    <div
      className="
      min-w-[180px]
      bg-white 
      rounded-2xl 
      shadow-md 
      p-6 
      border 
      border-gray-200
      hover:shadow-lg 
      hover:bg-gray-50
      transition 
      duration-200
      flex 
      flex-col 
      items-center
      justify-center
      text-center
    "
    >
      <div className="text-gray-600 text-sm font-medium tracking-wide">
        {titleHeader}
      </div>
      <div className="mt-3 text-3xl font-bold text-gray-900">{count}</div>
    </div>
  );
}
