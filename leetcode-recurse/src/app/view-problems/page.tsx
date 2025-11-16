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
function ProblemsViewPage() {
  const router = useRouter();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<ProblemDataStructure[]>([]);
  const [loading, setLoading] = useState(true);
  //for fileter
  const [difficultyFilter, setDifficultyFilter] = useState("any");
  const [sourceFilter, setSourceFilter] = useState("any");
  const [statusFilter, setStatusFilter] = useState("any");
  const [dateFilter, setDateFilter] = useState("any");
  const [filteredData, setFilteredData] = useState<ProblemDataStructure[]>([]);
  const [isFilterOn, setIsFilterOn] = useState<boolean>(false);
  // filter end
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/problems?page=${currentPage}&limit=10`);
        const result = await res.json();
        setData(result.problems);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchPage();
  }, [currentPage]);
  const handleReviewed = async (id: string) => {
    await toast.promise(
      async () => {
        const res = await fetch(`/api/problems/review/${id}`, {
          method: "POST",
        });

        if (!res.ok) throw new Error("Failed to review");

        const saved = await res.json();
        console.log("Problem reviewed:", saved);

        router.refresh(); //  correct
        return saved;
      },
      {
        loading: "Reviewing problem...",
        success: "Successfully reviewed the problem!",
        error: " Could not review problem",
      }
    );
  };

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

        router.refresh(); // refresh UI
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
    let filtered = [...data];

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
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-medium text-gray-700">Loading problem ...</p>
      </div>
    );
  return (
    <div className="">
      <div className="flex justify-center py-6">
        <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-row justify-around items-center relative">
            <h1 className="font-bold text-2xl mb-12">LIST OF YOUR PROBLEMS</h1>
            <div className="inline top-0 right-20">
              <Popover>
                <PopoverTrigger>
                  <div className="flex flex-row justify-around items-center">
                    <div className="px-4 py-2 border-2 border-gray-300 rounded-[10px]">
                      Open Filter
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  {/* LeetCode-style floating filter bar */}
                  <div className="sticky top-0 bg-white z-20 border-b py-4 mb-6">
                    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto px-2">
                      {/* Difficulty */}
                      <div className="flex items-center justify-around">
                        <span className="text-sm font-semibold text-gray-700">
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
                      <div className="flex items-center justify-around">
                        <span className="text-sm font-semibold text-gray-700">
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
                            { label: "coderchef", value: "coderchef" },
                            { label: "HackerRank", value: "hackerrank" },
                          ]}
                        />
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-around">
                        <span className="text-sm font-semibold text-gray-700">
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
                      <div className="flex items-center justify-around">
                        <span className="text-sm font-semibold text-gray-700">
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
                      <div className="flex justify-end items-center gap-3">
                        <Button
                          variant={"outline"}
                          onClick={() => {
                            setIsFilterOn(false);
                            setDifficultyFilter("any");
                            setSourceFilter("any");
                            setStatusFilter("any");
                            setDateFilter("any");
                            router.refresh();
                          }}
                          className="text-sm text-blue-600"
                        >
                          Reset
                        </Button>

                        <Button
                          variant={"outline"}
                          onClick={handleFilter}
                          className="text-sm"
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
              <Table className="text-sm">
                <TableCaption>
                  You have {totalPages} pages of problems.
                </TableCaption>

                <TableHeader>
                  <TableRow>
                    <TableHead>PROBLEM</TableHead>
                    <TableHead>DIFFICULTY</TableHead>
                    <TableHead>DATE SOLVED</TableHead>
                    <TableHead className="text-center">STATUS</TableHead>
                    {/* <TableHead>Times Reviewed</TableHead> */}
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        No problems added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((datum, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <Link href={`view-problems/${datum._id}`}>
                            <div className="flex items-center gap-4">
                              <img
                                src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${datum.source}.com&size=64`}
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
              <Table className="text-sm">
                <TableCaption>
                  You have {totalPages} pages of problems.
                </TableCaption>

                <TableHeader>
                  <TableRow>
                    <TableHead>PROBLEM</TableHead>
                    <TableHead>DIFFICULTY</TableHead>
                    <TableHead>DATE SOLVED</TableHead>
                    <TableHead className="text-center">STATUS</TableHead>
                    {/* <TableHead>Times Reviewed</TableHead> */}
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        No problems added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((datum, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <Link href={`view-problems/${datum._id}`}>
                            <div className="flex items-center gap-4">
                              <img
                                src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${datum.source}.com&size=64`}
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
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="px-4 py-2"
            >
              Previous
            </Button>

            <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md border">
              Page <b>{currentPage}</b> of <b>{totalPages}</b>
            </span>

            <Button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="px-4 py-2"
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
