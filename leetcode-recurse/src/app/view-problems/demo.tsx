"use client";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ProblemStatus from "./ProblemStatus";
import ProblemDifficultyStatus from "./ProblemDifficultyStatus";
import Details from "../../../public/Details.svg";
import Edit from "../../../public/Edit.svg";
import Delete from "../../../public/Delete.svg";
import CheckBox from "../../../public/checkbox.svg";

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
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<ProblemDataStructure[]>([]);

  useEffect(() => {
    const fetchPage = async () => {
      const res = await fetch(`/api/problems?page=${currentPage}&limit=10`);
      const result = await res.json();
      setData(result.problems);
      setTotalPages(result.totalPages);
    };

    fetchPage();
  }, [currentPage]);

  const handleReviewed = async (id: string) => {
    const res = await fetch(`/api/problems/review/${id}`, {
      method: "POST",
    });

    if (res.ok) {
      console.log("changed successfully");
      location.reload();
    }
  };

  const handleProblemDelete = async (_id: string) => {
    const res = await fetch(`/api/problems/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: _id }),
    });
    if (res.ok) {
      console.log("changed successfully");
      location.reload();
    }
  };

  const getReviewStatus = (nextDate: string, noOfTimesSolved: number) => {
    const today = new Date();
    const next = new Date(nextDate);
    if (noOfTimesSolved >= 7) return "Retired ";
    if (next > today) return "Active ";
    if (next.toDateString() === today.toDateString()) return "Due Today";
    return "Missed ";
  };

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
                        <Image
                          src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${datum.source}.com&size=64`}
                          alt="platform icon"
                          width={25}
                          height={25}
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

                  <TableCell className="">
                    <div className="flex items-center gap-3 ">
                      <button
                        type="button"
                        title="Details"
                        className="shrink-0 cursor-pointer"
                      >
                        <Image
                          src={Details}
                          width={20}
                          height={20}
                          alt="Details"
                        />
                      </button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            title="Edit"
                            className="shrink-0 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                          >
                            <Image
                              src={Edit}
                              width={18}
                              height={18}
                              alt="Edit"
                            />
                          </button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">
                              Edit Problem
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Update details and click save.
                            </DialogDescription>
                          </DialogHeader>

                          <form
                            className="grid gap-4 py-4"
                            onSubmit={async (e) => {
                              e.preventDefault();

                              const formData = new FormData(e.currentTarget);
                              const updatedProblem = {
                                id: datum._id,
                                problemName: formData.get("problemName"),
                                problemUrl: formData.get("problemUrl"),
                                difficulty: formData.get("difficulty"),
                                source: formData.get("source"),
                                notes: formData.get("notes"),
                              };

                              const res = await fetch("/api/problems/update", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(updatedProblem),
                              });

                              if (res.ok) {
                                console.log("Updated");
                                location.reload();
                              }
                            }}
                          >
                            <div className="grid gap-2">
                              <Label
                                htmlFor="problemName"
                                className="text-sm font-medium"
                              >
                                Problem Name
                              </Label>
                              <Input
                                id="problemName"
                                name="problemName"
                                defaultValue={datum.problemName}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label
                                htmlFor="problemUrl"
                                className="text-sm font-medium"
                              >
                                URL
                              </Label>
                              <Input
                                id="problemUrl"
                                name="problemUrl"
                                defaultValue={datum.problemUrl}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label
                                htmlFor="difficulty"
                                className="text-sm font-medium"
                              >
                                Difficulty
                              </Label>
                              <Input
                                id="difficulty"
                                name="difficulty"
                                defaultValue={datum.difficulty}
                                className="capitalize focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label
                                htmlFor="source"
                                className="text-sm font-medium"
                              >
                                Source
                              </Label>
                              <Input
                                id="source"
                                name="source"
                                defaultValue={datum.source}
                                className="capitalize focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label
                                htmlFor="notes"
                                className="text-sm font-medium"
                              >
                                Notes
                              </Label>
                              <Input
                                id="notes"
                                name="notes"
                                defaultValue={datum.notes}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <DialogFooter className="flex justify-end gap-3 pt-4">
                              <DialogClose asChild>
                                <button
                                  type="button"
                                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
                                >
                                  Cancel
                                </button>
                              </DialogClose>

                              <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                              >
                                Save changes
                              </button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <button
                        type="button"
                        title="Review"
                        className="shrink-0"
                        onClick={() => handleReviewed(datum._id)}
                      >
                        <Image
                          src={CheckBox}
                          width={20}
                          height={20}
                          alt="Review"
                        />
                      </button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            title="Delete"
                            className="shrink-0"
                          >
                            <Image
                              src={Delete}
                              width={20}
                              height={20}
                              alt="Delete"
                            />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogTitle className="text-xl font-semibold">
                            Do you want to delete this problem?
                          </DialogTitle>
                          <DialogFooter className="flex justify-end gap-3 pt-4">
                            <DialogClose asChild>
                              <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
                              >
                                Cancel
                              </button>
                            </DialogClose>

                            <button
                              onClick={() => handleProblemDelete(datum._id)}
                              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                            >
                              Delete
                            </button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
