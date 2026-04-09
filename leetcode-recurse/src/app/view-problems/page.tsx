"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Link from "next/link";
import { useState } from "react";
import ProblemStatus from "./ProblemStatus";
import ProblemDifficultyStatus from "./ProblemDifficultyStatus";
import { useRouter } from "next/navigation";
import UserActions from "./UserActions";
import FilterDropdown from "./FilterDropdown";
import useSWR, { mutate } from "swr";

type ProblemDataStructure = {
  _id: string;
  problemName: string;
  problemUrl: string;
  difficulty: string;
  source: string;
  notes: string;
  dateSolved: string;
  timesSolved: number;
  nextReviewDate: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ProblemsViewPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);

  // filters
  const [difficultyFilter, setDifficultyFilter] = useState("any");
  const [sourceFilter, setSourceFilter] = useState("any");
  const [statusFilter, setStatusFilter] = useState("any");
  const [dateFilter, setDateFilter] = useState("any");
  const [filteredData, setFilteredData] = useState<ProblemDataStructure[]>([]);
  const [isFilterOn, setIsFilterOn] = useState<boolean>(false);

  const { data, error, isLoading } = useSWR(
    `/api/problems?page=${currentPage}&limit=10`,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 5,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const handleProblemDelete = async (_id: string) => {
    await toast.promise(
      async () => {
        const res = await fetch(`/api/problems`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id }),
        });

        if (!res.ok) throw new Error("Failed to delete from database");

        const result = await res.json();
        console.log("Problem deleted from DB:", result);

        const githubRes = await fetch(`/api/github/delete-problem`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problemName: result?.deleted?.problemName,
          }),
        });

        if (!githubRes.ok) {
          console.warn("GitHub delete failed");
        }

        mutate("/api/dashboard/summary");
        mutate("/api/dashboard/weekly-progress");
        mutate("/api/dashboard/upcoming-reviews");
        mutate("/api/dashboard/recent-activity");
        mutate("/api/problems/all");
        mutate(`/api/problems?page=${currentPage}&limit=10`);

        return result;
      },
      {
        loading: "Deleting problem...",
        success: "Problem deleted successfully!",
        error: "Failed to delete problem",
      },
    );
  };

  const handleFilter = () => {
    setIsFilterOn(true);
    let filtered = [...data.problems];

    if (difficultyFilter !== "any") {
      filtered = filtered.filter(
        (p) => p.difficulty.toLowerCase() === difficultyFilter.toLowerCase(),
      );
    }

    if (sourceFilter !== "any") {
      filtered = filtered.filter(
        (p) => p.source.toLowerCase() === sourceFilter.toLowerCase(),
      );
    }

    if (statusFilter !== "any") {
      const today = new Date();

      filtered = filtered.filter((p) => {
        const next = new Date(p.nextReviewDate);
        const times = p.timesSolved;

        if (statusFilter === "retired") return times >= 7;
        if (statusFilter === "active") return next > today;
        if (statusFilter === "due")
          return next.toDateString() === today.toDateString();
        if (statusFilter === "missed") return next < today && times < 7;

        return true;
      });
    }

    if (dateFilter !== "any") {
      const today = new Date();

      filtered = filtered.filter((p) => {
        const solved = new Date(p.dateSolved);

        if (dateFilter === "today") {
          return solved.toDateString() === today.toDateString();
        }

        if (dateFilter === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          return solved >= weekAgo && solved <= today;
        }

        if (dateFilter === "month") {
          const monthAgo = new Date();
          monthAgo.setMonth(today.getMonth() - 1);
          return solved >= monthAgo && solved <= today;
        }

        return true;
      });
    }

    setFilteredData(filtered);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d]">
        <div className="flex justify-center py-10">
          <div className="w-full max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            Failed to load problems.
          </div>
        </div>
      </div>
    );
  }

  const tableData = isFilterOn ? filteredData : (data?.problems ?? []);

  return (
    <div className="mt-14 min-h-screen bg-gray-50 dark:bg-[#0d0d0d]">
      <div className="flex justify-center py-6 px-4">
        <div className="w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#121212] dark:text-[#e5e5e5]">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#e5e5e5]">
                LIST OF YOUR PROBLEMS
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track, review, and manage all your solved problems in one place.
              </p>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer border-gray-300 bg-white text-gray-800 hover:bg-gray-100 dark:border-[#262626] dark:bg-[#1f1f1f] dark:text-[#e5e5e5] dark:hover:bg-[#1b1b1b]"
                >
                  Open Filter
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-[320px] border border-gray-200 bg-white p-0 shadow-lg dark:border-[#262626] dark:bg-[#121212]"
              >
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white py-4 dark:border-[#262626] dark:bg-[#121212]">
                  <div className="flex flex-col gap-4 px-4">
                    {/* Difficulty */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Difficulty:
                      </span>
                      <FilterDropdown
                        label=""
                        value={difficultyFilter}
                        onChange={setDifficultyFilter}
                        options={[
                          { label: "Difficulty", value: "any" },
                          { label: "Easy", value: "easy" },
                          { label: "Medium", value: "medium" },
                          { label: "Hard", value: "hard" },
                        ]}
                      />
                    </div>

                    {/* Source */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Source:
                      </span>
                      <FilterDropdown
                        label=""
                        value={sourceFilter}
                        onChange={setSourceFilter}
                        options={[
                          { label: "Platform", value: "any" },
                          { label: "LeetCode", value: "leetcode.com" },
                          { label: "GFG", value: "geeksforgeeks.org" },
                          { label: "Codeforces", value: "codeforces.com" },
                          { label: "CodeChef", value: "coderchef.com" },
                          { label: "HackerRank", value: "hackerrank.com" },
                        ]}
                      />
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Status:
                      </span>
                      <FilterDropdown
                        label=""
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                          { label: "Status", value: "any" },
                          { label: "Active", value: "active" },
                          { label: "Due Today", value: "due" },
                          { label: "Missed", value: "missed" },
                          { label: "Retired", value: "retired" },
                        ]}
                      />
                    </div>

                    {/* Date */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Date:
                      </span>
                      <FilterDropdown
                        label=""
                        value={dateFilter}
                        onChange={setDateFilter}
                        options={[
                          { label: "Date", value: "any" },
                          { label: "Today", value: "today" },
                          { label: "This Week", value: "week" },
                          { label: "This Month", value: "month" },
                        ]}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsFilterOn(false);
                          setDifficultyFilter("any");
                          setSourceFilter("any");
                          setStatusFilter("any");
                          setDateFilter("any");
                          router.refresh();
                        }}
                        className="w-30 cursor-pointer border-blue-600 text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        Reset
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleFilter}
                        className="w-30 cursor-pointer border-gray-300 text-sm text-gray-700 hover:bg-gray-100 dark:border-[#262626] dark:text-gray-200 dark:hover:bg-[#1f1f1f]"
                      >
                        Filter
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#262626]">
            <Table className="text-sm dark:text-[#a3a3a3]">
              <TableCaption className="py-4 text-gray-500 dark:text-gray-400">
                {isLoading ? (
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-[180px]" />
                  </div>
                ) : (
                  <>You have {data.totalPages} pages of problems.</>
                )}
              </TableCaption>

              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a]">
                  <TableHead className="text-gray-600 dark:text-gray-500">
                    PROBLEM
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-500">
                    DIFFICULTY
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-500">
                    DATE SOLVED
                  </TableHead>
                  <TableHead className="text-center text-gray-600 dark:text-gray-500">
                    STATUS
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-500">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  [...Array(6)].map((_, index) => (
                    <TableRow key={index} className="h-[72px]">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-6 w-6 rounded-xl" />
                          <Skeleton className="h-4 w-[180px]" />
                        </div>
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Skeleton className="h-6 w-[90px] rounded-full" />
                        </div>
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : tableData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-10 text-center text-gray-500 dark:text-gray-500"
                    >
                      No problems added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map(
                    (datum: ProblemDataStructure, index: number) => (
                      <TableRow
                        key={index}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-[#1f1f1f]"
                      >
                        <TableCell className="font-medium">
                          <Link
                            href={`view-problems/${datum._id}`}
                            className="group"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${datum.source}&size=64`}
                                alt="platform icon"
                                width="25"
                                height="25"
                                className="rounded-xl"
                              />
                              <span className="text-gray-900 transition-colors group-hover:text-blue-600 dark:text-[#e5e5e5] dark:group-hover:text-blue-400">
                                {datum.problemName}
                              </span>
                            </div>
                          </Link>
                        </TableCell>

                        <TableCell className="capitalize">
                          <ProblemDifficultyStatus
                            difficulty={datum.difficulty}
                          />
                        </TableCell>

                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {new Date(datum.dateSolved).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="text-center font-semibold">
                          <ProblemStatus
                            nextReviewDate={datum.nextReviewDate}
                            timesSolved={datum.timesSolved}
                          />
                        </TableCell>

                        <TableCell>
                          <UserActions
                            data={datum}
                            onDelete={handleProblemDelete}
                          />
                        </TableCell>
                      </TableRow>
                    ),
                  )
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-[90px] rounded-md" />
                <Skeleton className="h-10 w-[140px] rounded-md" />
                <Skeleton className="h-10 w-[90px] rounded-md" />
              </>
            ) : (
              <>
                <Button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="cursor-pointer px-4 py-2 dark:border-[#262626] dark:bg-[#121212] dark:hover:bg-[#1f1f1f]"
                >
                  Previous
                </Button>

                <span className="rounded-md border bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:border-[#262626] dark:bg-[#0d0d0d] dark:text-gray-400">
                  Page <b>{currentPage}</b> of <b>{data.totalPages}</b>
                </span>

                <Button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === data.totalPages}
                  variant="outline"
                  className="cursor-pointer px-4 py-2 dark:border-[#262626] dark:bg-[#121212] dark:hover:bg-[#1f1f1f]"
                >
                  Next
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemsViewPage;
