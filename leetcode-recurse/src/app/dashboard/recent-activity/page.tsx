"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import DeleteIcon from "@/../../public/deleteIcon.svg";
import Link from "next/link";
import useSWR from "swr";
// Common props interface for all icons
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

// ➕ Add Icon
const PlusIcon: React.FC<IconProps> = (props) => (
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
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

// 🔁 Review Icon
const ClockIcon: React.FC<IconProps> = (props) => (
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
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0Z"
    />
  </svg>
);

// ✏️ Edit Icon
const PencilIcon: React.FC<IconProps> = (props) => (
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
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.649-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
    />
  </svg>
);

const TrashIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6h18M10 11v6m4-6v6M5 6l1.5 14a2 2 0 002 2h7a2 2 0 002-2L19 6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
    />
  </svg>
);

// Activity log type
interface ActivityLog {
  _id: string;
  type: "add" | "review" | "edit" | "delete";
  problemName: string;
  timestamp: string;
}

// Simple “time ago” formatter
function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} days ago`;

  return new Date(dateStr).toLocaleDateString();
}

// Icon map
const icons: Record<string, React.FC<IconProps>> = {
  add: PlusIcon,
  review: ClockIcon,
  edit: PencilIcon,
  delete: TrashIcon,
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function RecentActivityLog() {
  // const [logs, setLogs] = useState<ActivityLog[]>([]);
  // const [loading, setLoading] = useState(true);
  const { data, error, isLoading } = useSWR(
    "/api/dashboard/all-recent-activity",
    fetcher
  );
  // useEffect(() => {
  //   const fetchLogs = async () => {
  //     try {
  //       const res = await fetch("/api/dashboard/recent-activity");
  //       const data = await res.json();
  //       setLogs(data);
  //     } catch (error) {
  //       console.error("Failed to fetch activity log", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchLogs();
  // }, []);

  if (isLoading)
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Loading activity...</p>
      </div>
    );
  if (error) return <p className="text-red-500">Failed to load activity</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 mt-20">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent activity.</p>
      ) : (
        <ul className="space-y-4">
          {data.map((log: ActivityLog) => {
            const Icon = icons[log.type];
            return (
              <li
                key={log._id}
                className="flex items-start gap-3 border-b pb-3 last:border-none"
              >
                {/* Render SVG Component */}
                <span className="w-6 h-6 text-gray-700">
                  <Icon className="w-6 h-6" />
                </span>

                <div className="flex flex-col">
                  {/* Activity Line */}
                  <p className="text-gray-800">
                    {log.type === "add" && (
                      <>
                        Added <b>{log.problemName}</b>
                      </>
                    )}
                    {log.type === "review" && (
                      <>
                        Reviewed <b>{log.problemName}</b>
                      </>
                    )}
                    {log.type === "edit" && (
                      <>
                        Updated <b>{log.problemName}</b>
                      </>
                    )}
                    {log.type === "delete" && (
                      <>
                        Deleted <b>{log.problemName}</b>
                      </>
                    )}
                  </p>

                  {/* Timestamp */}
                  <span className="text-sm text-gray-500">
                    {timeAgo(log.timestamp)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
