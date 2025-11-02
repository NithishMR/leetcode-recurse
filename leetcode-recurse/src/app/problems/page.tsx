"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DifficultyDropdown } from "./DifficultyDropdown";
import { Textarea } from "@/components/ui/textarea";
import { CalendarPicker } from "./DateSolved";
import { Button } from "@/components/ui/button";
import { PlatformDropdown } from "./PlatformDropdown";

interface Problem {
  _id?: string;
  problemName: string;
  problemUrl: string;
  difficulty: string;
  source: string; // renamed from platform to match backend
  notes: string;
  dateSolved: string;
}

// TextArea component
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
  // Form states
  const [problemName, setProblemName] = useState<string>("");
  const [problemUrl, setProblemUrl] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [source, setSource] = useState<string>(""); // renamed platform -> source
  const [notes, setNotes] = useState<string>("");
  const [dateSolved, setDateSolved] = useState<Date | undefined>(undefined);

  // Handle form submission
  const handleAddProblem = async () => {
    const newProblem = {
      problemName,
      problemUrl,
      difficulty,
      source, // normalize case
      notes,
      dateSolved: dateSolved ? dateSolved.toISOString() : undefined, // add the nextreviewdate here instead of Problem.ts
      nextReviewDate: dateSolved
        ? new Date(dateSolved.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
    };

    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProblem),
      });

      const saved = await res.json();
      console.log("Problem saved:", saved);

      // Reset form fields
      setProblemName("");
      setProblemUrl("");
      setDifficulty("Easy");
      setSource("");
      setNotes("");
      setDateSolved(undefined);
    } catch (error) {
      console.error("Error saving problem:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6 space-y-8">
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

        {/* Platform / Source */}
        {/* <div className="flex flex-col">
          <Label htmlFor="source" className="mb-1 text-gray-700 font-medium">
            Platform Name
          </Label>
          <Input
            id="source"
            type="text"
            placeholder="Example: LeetCode"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div> */}
        <div className="flex flex-col">
          <Label htmlFor="source" className="mb-1 text-gray-700 font-medium">
            Platform Name
          </Label>
          <PlatformDropdown value={source} onChange={setSource} />
        </div>

        {/* Notes */}
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
    </div>
  );
};

export default ProblemAdditionPage;
