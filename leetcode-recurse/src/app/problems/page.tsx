"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DifficultyDropdown } from "./DifficultyDropdown";
import { Textarea } from "@/components/ui/textarea";
import { CalendarPicker } from "./DateSolved";
import { Button } from "@/components/ui/button";

interface Problem {
  _id?: string;
  problemName: string;
  problemUrl: string;
  difficulty: string;
  platform: string;
  notes: string;
  dateSolved: string; // or Date if you store it as Date
}

export function TextArea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Add your notes or key trick..."
      className="resize-none h-32"
    />
  );
}

const ProblemAdditionPage = () => {
  // Form States
  const [problemName, setProblemName] = useState<string>("");
  const [problemUrl, setProblemUrl] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [platform, setPlatform] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [dateSolved, setDateSolved] = useState<Date | undefined>(undefined);

  // Data Fetch States
  const [problemData, setProblemData] = useState<Problem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate fetching problems from MongoDB
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        // Replace with your API call later
        // const res = await fetch("/api/problems");
        // const data = await res.json();
        const data: Problem[] = []; // empty array for now
        setProblemData(data);
      } catch (error) {
        console.error(error);
        setProblemData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleAddProblem = () => {
    const newProblem: Problem = {
      problemName,
      problemUrl,
      difficulty,
      platform,
      notes,
      dateSolved: dateSolved ? dateSolved.toISOString() : "",
    };

    // For now, just log it and update local state
    console.log("Problem Added:", newProblem);
    setProblemData((prev) => (prev ? [...prev, newProblem] : [newProblem]));

    // Reset form fields
    setProblemName("");
    setProblemUrl("");
    setDifficulty("Easy");
    setPlatform("");
    setNotes("");
    setDateSolved(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6 space-y-8">
      {/* Form Container */}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <h1 className="col-span-1 md:col-span-2 text-3xl font-bold text-gray-800 text-center mb-6">
          Add a New Problem
        </h1>

        {/* Problem Name */}
        <div className="flex flex-col">
          <Label
            htmlFor="problemName"
            className="mb-1 text-gray-700 font-medium"
          >
            Problem Name
          </Label>
          <Input
            id="problemName"
            type="text"
            placeholder="Example: Two Sum"
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Problem URL */}
        <div className="flex flex-col">
          <Label
            htmlFor="problemUrl"
            className="mb-1 text-gray-700 font-medium"
          >
            Problem URL
          </Label>
          <Input
            id="problemUrl"
            type="url"
            placeholder="https://url"
            value={problemUrl}
            onChange={(e) => setProblemUrl(e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Difficulty */}
        <div className="flex flex-col">
          <Label
            htmlFor="difficulty"
            className="mb-1 text-gray-700 font-medium"
          >
            Difficulty
          </Label>
          <DifficultyDropdown value={difficulty} onChange={setDifficulty} />
        </div>

        {/* Platform */}
        <div className="flex flex-col">
          <Label htmlFor="platform" className="mb-1 text-gray-700 font-medium">
            Platform Name
          </Label>
          <Input
            id="platform"
            type="text"
            placeholder="Example: LeetCode"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Notes (full width) */}
        <div className="flex flex-col md:col-span-2">
          <Label htmlFor="notes" className="mb-1 text-gray-700 font-medium">
            Notes / Key Trick
          </Label>
          <TextArea value={notes} onChange={setNotes} />
        </div>

        {/* Date Solved */}
        <div className="flex flex-col">
          <Label
            htmlFor="dateSolved"
            className="mb-1 text-gray-700 font-medium"
          >
            Date Solved
          </Label>
          <CalendarPicker value={dateSolved} onChange={setDateSolved} />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center md:col-span-2 mt-4">
          <Button
            size="lg"
            variant="default"
            className="w-full md:w-1/2"
            onClick={handleAddProblem}
          >
            Add Problem
          </Button>
        </div>
      </div>

      {/* Problems Display */}
      <div className="w-full max-w-4xl space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : problemData && problemData.length > 0 ? (
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(problemData, null, 2)}
          </pre>
        ) : (
          <div className="text-center text-gray-500">No problems found</div>
        )}
      </div>
    </div>
  );
};

export default ProblemAdditionPage;
