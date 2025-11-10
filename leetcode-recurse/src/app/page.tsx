import { Button } from "@/components/ui/button";

import DifficultyDistribution from "./dashboard/DifficultyDistribution";
import Link from "next/link";
import UpcomingReviews from "./dashboard/UpcomingReviews";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-black flex items-center justify-center py-10">
      {/* Main container - CENTERED */}
      <div className="flex flex-col items-center justify-around w-full max-w-5xl px-6 space-y-14">
        {/* Hero Section */}
        <section className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome back, Nithish 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your daily review productivity hub
          </p>
        </section>

        {/* Today's Summary */}
        <section className=" flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Today's Summary
          </h2>

          <div className="">
            <UpcomingReviews />
          </div>
        </section>

        {/* Next Actions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Next Actions
          </h2>

          <div className="flex flex-wrap gap-4">
            <Link href={"/problems"}>
              <Button variant="outline" className="px-6">
                Add Problem
              </Button>
            </Link>

            <Link href={"/view-problems"}>
              <Button variant="outline" className="px-6">
                View All Problems
              </Button>
            </Link>

            <Link href={"/dashboard"}>
              <Button variant="outline" className="px-6">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
