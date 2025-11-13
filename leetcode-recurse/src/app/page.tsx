import { Button } from "@/components/ui/button";
import Link from "next/link";
import UpcomingReviews from "./dashboard/UpcomingReviews";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-zinc-50 dark:bg-black flex items-start justify-center py-12">
      {/* ✅ Floating Avatar, does NOT affect layout */}
      <div className="fixed top-4 right-4 z-50">
        <Popover>
          <PopoverTrigger>
            <Avatar className="cursor-pointer shadow">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </PopoverTrigger>

          <PopoverContent className="w-48">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              View Account Settings
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* ✅ Main centered wrapper */}
      <div className="w-full max-w-4xl px-6 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome back, Nithish 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your daily review productivity hub
          </p>
        </section>

        {/* Notes */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Note for User
          </h2>

          <div className="bg-white dark:bg-zinc-900 shadow-sm border rounded-xl p-6 space-y-3 text-lg text-gray-700 dark:text-gray-300">
            <p>
              Home: <code className="text-blue-600">/</code>
            </p>
            <p>
              Dashboard: <code className="text-blue-600">/dashboard</code>
            </p>
            <p>
              Add Problem(s): <code className="text-blue-600">/problems</code>
            </p>
            <p>
              View Problems:{" "}
              <code className="text-blue-600">/view-problems</code>
            </p>
            <p>
              Account settings:{" "}
              <code className="text-blue-600">/account-settings</code>
            </p>
          </div>
        </section>

        {/* Upcoming */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
            Problems to Solve This Week
          </h2>

          <div className="flex justify-center">
            <UpcomingReviews />
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
            Next Actions
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/problems">
              <Button variant="outline" className="px-6">
                Add Problem
              </Button>
            </Link>

            <Link href="/view-problems">
              <Button variant="outline" className="px-6">
                View All Problems
              </Button>
            </Link>

            <Link href="/dashboard">
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
