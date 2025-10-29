"use client";
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

type ProblemDataStructure = {
  _id: { $oid: string };
  problemName: string;
  problemUrl: string;
  difficulty: string;
  source: string;
  notes: string;
  dateSolved: string;
  status: string;
  nextReviewDate: string;
};
function ProblemsViewPage() {
  const [data, setData] = useState<ProblemDataStructure[]>([]);

  const processDataRetrieval = async () => {
    try {
      const rawProblemsData = await fetch("/api/problems");
      console.log(rawProblemsData);
      const fetchedData = await rawProblemsData.json();
      // console.log(fetchedData);
      // mock data for now
      setData(fetchedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    processDataRetrieval();
  }, []);

  return (
    <div className="">
      <h1 className="text-center font-bold text-xl mb-4">Your Problems</h1>

      <Table>
        <TableCaption>A list of your problems.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Problem</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Date Solved</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Review</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No problems added yet.
              </TableCell>
            </TableRow>
          ) : (
            data.map((datum, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Link href={datum.problemUrl} target="_blank">
                    {datum.problemName}
                  </Link>
                </TableCell>

                <TableCell>{datum.difficulty}</TableCell>
                <TableCell>{datum.source}</TableCell>

                <TableCell>
                  {new Date(datum.dateSolved).toLocaleDateString()}
                </TableCell>

                <TableCell>{datum.status}</TableCell>

                <TableCell>
                  {new Date(datum.nextReviewDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProblemsViewPage;
