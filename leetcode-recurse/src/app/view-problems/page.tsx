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

import Link from "next/link";
import { useState, useEffect } from "react";
import ProblemStatus from "./ProblemStatus";
import ProblemDifficultyStatus from "./ProblemDifficultyStatus";

import { useRouter } from "next/navigation";
import UserActions from "./UserActions";

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

  const handleViewProblem = (id: string) => {
    router.push(`/view-problems/${id}`);
  };
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
    <div className="flex justify-center py-6">
      <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-sm">
        <h1 className="font-bold text-2xl text-center mb-6">
          List of Problems
        </h1>

        <Table className="text-sm">
          <TableCaption>You have {totalPages} pages of problems.</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Date Solved</TableHead>
              <TableHead>Status</TableHead>
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
                    <Link href={datum.problemUrl} target="_blank">
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
                    <ProblemDifficultyStatus difficulty={datum.difficulty} />
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
                      onView={handleViewProblem}
                      onReview={handleReviewed}
                      onDelete={handleProblemDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
  );
}

export default ProblemsViewPage;
