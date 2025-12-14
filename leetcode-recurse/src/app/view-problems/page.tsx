"use client";
import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";
import ProblemStatus from "./ProblemStatus";
import ProblemDifficultyStatus from "./ProblemDifficultyStatus";
import { useRouter } from "next/navigation";
import UserActions from "./UserActions";
import FilterDropdown from "./FilterDropdown";
import FilterIcon from "@/../../public/filter.svg";
import ResetIcon from "@/../../public/reset.svg";
import Image from "next/image";
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
  // const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  //const [data, setData] = useState<ProblemDataStructure[]>([]);
  // const [loading, setLoading] = useState(true);
  //for fileter
  const [difficultyFilter, setDifficultyFilter] = useState("any");
  const [sourceFilter, setSourceFilter] = useState("any");
  const [statusFilter, setStatusFilter] = useState("any");
  const [dateFilter, setDateFilter] = useState("any");
  const [filteredData, setFilteredData] = useState<ProblemDataStructure[]>([]);
  const [isFilterOn, setIsFilterOn] = useState<boolean>(false);
  // filter end
  const { data, error, isLoading } = useSWR(
    `/api/problems?page=${currentPage}&limit=10`,
    fetcher
  );
  // useEffect(() => {
  //   const fetchPage = async () => {
  //     try {
  //       const res = await fetch(`/api/problems?page=${currentPage}&limit=10`);
  //       const result = await res.json();
  //       // setData(result.problems);
  //       // setTotalPages(result.totalPages);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setTimeout(() => setLoading(false), 500);
  //     }
  //   };

  //   fetchPage();
  // }, [currentPage]);
  // const handleReviewed = async (id: string) => {
  //   await toast.promise(
  //     async () => {
  //       const res = await fetch(`/api/problems/review/${id}`, {
  //         method: "POST",
  //       });

  //       if (!res.ok) throw new Error("Failed to review");

  //       const saved = await res.json();
  //       console.log("Problem reviewed:", saved);

  //       router.refresh(); //  correct
  //       return saved;
  //     },
  //     {
  //       loading: "Reviewing problem...",
  //       success: "Successfully reviewed the problem!",
  //       error: " Could not review problem",
  //     }
  //   );
  // };

  const handleProblemDelete = async (_id: string) => {
    await toast.promise(
      async () => {
        const res = await fetch(`/api/problems`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id }),
        });

        if (!res.ok) throw new Error("Failed to delete");

        const result = await res.json();
        console.log("Problem deleted:", result);
        mutate("/api/dashboard/summary");
        mutate("/api/dashboard/weekly-progress");
        mutate("/api/dashboard/upcoming-reviews");
        mutate("/api/dashboard/recent-activity");

        // router.refresh(); // refresh UI
        return result;
      },
      {
        loading: "Deleting problem...",
        success: "Problem deleted successfully!",
        error: "Failed to delete problem",
      }
    );
  };

  //handle filter
  const handleFilter = () => {
    setIsFilterOn(true);
    let filtered = [...data.problems];

    //  Difficulty filter
    if (difficultyFilter !== "any") {
      filtered = filtered.filter(
        (p) => p.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    // Platform/Source filter
    if (sourceFilter !== "any") {
      filtered = filtered.filter(
        (p) => p.source.toLowerCase() === sourceFilter.toLowerCase()
      );
    }

    // Status filter (Active, Due Today, Missed, Retired)
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

    //  Date filter (Today, This Week, This Month)
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

  //end of handlefilter
  // const handleViewProblem = (id: string) => {
  //   router.push(`/view-problems/${id}`);
  // };
  // const getReviewStatus = (nextDate: string, noOfTimesSolved: number) => {
  //   const today = new Date();
  //   const next = new Date(nextDate);
  //   if (noOfTimesSolved >= 7) return "Retired ";
  //   if (next > today) return "Active ";
  //   if (next.toDateString() === today.toDateString()) return "Due Today";
  //   return "Missed ";
  // };
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-black">
        <p className="text-xl font-medium text-gray-700 dark:text-white">
          Loading problem ...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-500 dark:bg-black dark:text-red-400">
        Failed to load upcoming reviews.
      </div>
    );
  return (
    <div className="mt-14 dark:bg-[#0d0d0d]">
      <div className="flex justify-center py-6">
        <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-sm  dark:bg-[#0d0d0d] dark:text-[#e5e5e5]">
          <div className="flex flex-row justify-around items-center relative">
            <h1 className="font-bold text-2xl mb-12 dark:text-[#e5e5e5]">
              LIST OF YOUR PROBLEMS
            </h1>
            <div className="inline top-0 right-20 ">
              <Popover>
                <PopoverTrigger>
                  <div className="flex justify-around items-center">
                    <div className="px-4 py-2 rounded-lg cursor-pointer border border-gray-300 bg-white text-gray-800 hover:bg-gray-100transition dark:bg-[#1f1f1f] dark:border-[#262626] dark:text-[#e5e5e5] dark:hover:bg-[#1b1b1b]">
                      Open Filter
                    </div>
                  </div>
                </PopoverTrigger>

                <PopoverContent
                  className="
      p-0
      bg-white border border-gray-200
      dark:bg-[#121212] dark:border-[#262626]
    "
                >
                  {/* Floating filter bar */}
                  <div
                    className="
        sticky top-0 z-20
        border-b border-gray-200
        py-4 mb-6

        bg-white
        dark:bg-[#121212]
        dark:border-[#262626]
      "
                  >
                    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto px-4">
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
                            { label: "LeetCode", value: "leetcode" },
                            { label: "GFG", value: "geeksforgeeks" },
                            { label: "Codeforces", value: "codeforces" },
                            { label: "CodeChef", value: "coderchef" },
                            { label: "HackerRank", value: "hackerrank" },
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
                      <div className="flex justify-around items-center gap-3 pt-2 ">
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
                          className="cursor-pointer w-28 text-sm
              text-blue-600 border-blue-600
              hover:bg-blue-50

              dark:text-blue-400
              dark:border-blue-500
              dark:hover:bg-blue-900/20
            "
                        >
                          Reset
                        </Button>

                        <Button
                          variant="outline"
                          onClick={handleFilter}
                          className="cursor-pointer 
              w-28 text-sm
              border-gray-300 text-gray-700
              hover:bg-gray-100

              dark:border-[#262626]
              dark:text-gray-200
              dark:hover:bg-[#1f1f1f]
            "
                        >
                          Filter
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {isFilterOn == true ? (
            <div className="">
              <Table className="text-sm rounded-lg">
                <TableCaption>
                  You have {data.totalPages} pages of problems.
                </TableCaption>

                <TableHeader className="">
                  <TableRow className="dark:bg-[#1f1f1f]">
                    <TableHead className="dark:text-gray-500">
                      PROBLEM
                    </TableHead>
                    <TableHead className="dark:text-gray-500">
                      DIFFICULTY
                    </TableHead>
                    <TableHead className="dark:text-gray-500">
                      DATE SOLVED
                    </TableHead>
                    <TableHead className="text-center dark:text-gray-500">
                      STATUS
                    </TableHead>
                    {/* <TableHead>Times Reviewed</TableHead> */}
                    <TableHead className="dark:text-gray-500">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.problems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-6 dark:text-gray-500"
                      >
                        No problems added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((datum, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 hover:text-black dark:hover:bg-[#1f1f1f] "
                      >
                        <TableCell className="font-medium dark:hover:text-blue-400">
                          <Link href={`view-problems/${datum._id}`}>
                            <div className="flex items-center gap-4">
                              <img
                                src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${datum.source}&size=64`}
                                alt="platform icon"
                                width="25"
                                height="25"
                                className="rounded-xl"
                              />
                              {datum.problemName}
                            </div>
                          </Link>
                        </TableCell>

                        <TableCell className="capitalize">
                          <ProblemDifficultyStatus
                            difficulty={datum.difficulty}
                          />
                        </TableCell>

                        <TableCell>
                          {new Date(datum.dateSolved).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="font-semibold text-center">
                          <ProblemStatus
                            nextReviewDate={datum.nextReviewDate}
                            timesSolved={datum.timesSolved}
                          />
                        </TableCell>

                        {/* <TableCell className="flex items-center justify-center">
                    {datum.timesSolved}
                  </TableCell> */}

                        {/* <TableCell>
                    {new Date(datum.nextReviewDate).toLocaleDateString()}
                  </TableCell> */}
                        <TableCell className="">
                          <UserActions
                            data={datum}
                            onDelete={handleProblemDelete}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="">
              <Table className="text-sm dark:text-[#a3a3a3]">
                <TableCaption>
                  You have {data.totalPages} pages of problems.
                </TableCaption>

                <TableHeader className="">
                  <TableRow className="dark:bg-[#1f1f1f]">
                    <TableHead className="dark:text-gray-500">
                      PROBLEM
                    </TableHead>
                    <TableHead className="dark:text-gray-500">
                      DIFFICULTY
                    </TableHead>
                    <TableHead className="dark:text-gray-500">
                      DATE SOLVED
                    </TableHead>
                    <TableHead className="text-center dark:text-gray-500">
                      STATUS
                    </TableHead>
                    {/* <TableHead>Times Reviewed</TableHead> */}
                    <TableHead className="dark:text-gray-500">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.problems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-6 dark:text-gray-500"
                      >
                        No problems added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.problems.map(
                      (datum: ProblemDataStructure, index: number) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-[#1f1f1f] "
                        >
                          <TableCell className="font-medium  dark:hover:text-blue-400">
                            <Link href={`view-problems/${datum._id}`}>
                              <div className="flex items-center gap-4">
                                <img
                                  src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${datum.source}&size=64`}
                                  alt="platform icon"
                                  width="25"
                                  height="25"
                                  className="rounded-xl"
                                />
                                {datum.problemName}
                              </div>
                            </Link>
                          </TableCell>

                          <TableCell className="capitalize">
                            <ProblemDifficultyStatus
                              difficulty={datum.difficulty}
                            />
                          </TableCell>

                          <TableCell>
                            {new Date(datum.dateSolved).toLocaleDateString()}
                          </TableCell>

                          <TableCell className="font-semibold text-center">
                            <ProblemStatus
                              nextReviewDate={datum.nextReviewDate}
                              timesSolved={datum.timesSolved}
                            />
                          </TableCell>

                          {/* <TableCell className="flex items-center justify-center">
                    {datum.timesSolved}
                  </TableCell> */}

                          {/* <TableCell>
                    {new Date(datum.nextReviewDate).toLocaleDateString()}
                  </TableCell> */}
                          <TableCell className="">
                            <UserActions
                              data={datum}
                              onDelete={handleProblemDelete}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="px-4 py-2 hover:cursor-pointer"
            >
              Previous
            </Button>

            <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md border dark:bg-[#0d0d0d] dark:text-gray-400">
              Page <b>{currentPage}</b> of <b>{data.totalPages}</b>
            </span>

            <Button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === data.totalPages}
              variant="outline"
              className="px-4 py-2 cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemsViewPage;
