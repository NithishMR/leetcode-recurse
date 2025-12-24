import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link2, Edit3 } from "lucide-react";

export default function ProblemsEntryPage() {
  return (
    <div className="min-h-screen mt-14 flex items-center justify-center px-4 bg-gray-50 dark:bg-[#0d0d0d]">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Add a Problem
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose how you want to log your solved problem
          </p>
        </div>

        {/* Add by URL (Primary) */}
        <div className="border border-gray-200 dark:border-[#262626] dark:bg-[#161616]">
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-blue-600 dark:text-blue-400">
                <Link2 size={20} />
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="font-medium text-gray-900 dark:text-gray-100">
                  Add using Problem URL
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Paste a LeetCode problem link and we’ll auto-fill the details.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                LeetCode only (for now)
              </span>

              <Link href="/problems/add-by-url">
                <Button className="gap-2 cursor-pointer">
                  Continue <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Add manually (Secondary) */}
        <div className="border border-gray-200 dark:border-[#262626] dark:bg-[#161616]">
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-gray-600 dark:text-gray-400">
                <Edit3 size={20} />
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="font-medium text-gray-900 dark:text-gray-100">
                  Add Manually
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter problem details yourself for known platform.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/problems/add-manually">
                <Button
                  variant="outline"
                  className="gap-2 dark:border-[#303030] cursor-pointer"
                >
                  Add manually <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle footer hint */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-500">
          More platforms will be supported soon.
        </p>
      </div>
    </div>
  );
}
