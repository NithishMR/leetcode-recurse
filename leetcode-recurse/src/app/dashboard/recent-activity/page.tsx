"use client";

import { Button } from "@/components/ui/button";
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
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
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
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
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
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.649-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
    />
  </svg>
);

// 🗑️ Delete Icon
const TrashIcon: React.FC<IconProps> = (props) => (
  <svg
    {...props}
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

// Time ago formatter
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
  const { data, error, isLoading } = useSWR(
    "/api/dashboard/all-recent-activity",
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 5,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-md dark:bg-[#161616] dark:border-[#262626] dark:shadow-none">
        <p className="text-gray-500 dark:text-gray-400">Loading activity...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Failed to load activity</p>;
  }

  return (
    <div
      className="
        mt-20
        bg-white p-6 rounded-2xl border shadow-md
        dark:bg-[#161616]
        dark:border-[#262626]
        dark:shadow-none
      "
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-[#e5e5e5]">
        Recent Activity
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No recent activity.
        </p>
      ) : (
        <ul className="space-y-4">
          {data.map((log: ActivityLog) => {
            const Icon = icons[log.type];
            return (
              <li
                key={log._id}
                className="
                  flex items-start gap-3
                  border-b border-gray-200 pb-3 last:border-none
                  dark:border-[#262626]
                "
              >
                <span className="w-6 h-6 text-gray-700 dark:text-gray-300">
                  <Icon className="w-6 h-6" />
                </span>

                <div className="flex flex-col">
                  <p className="text-gray-800 dark:text-gray-200">
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

                  <span className="text-sm text-gray-500 dark:text-gray-400">
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
