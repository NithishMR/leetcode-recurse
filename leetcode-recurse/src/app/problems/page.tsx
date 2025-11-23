"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DifficultyDropdown } from "./DifficultyDropdown";
import { Textarea } from "@/components/ui/textarea";
import { CalendarPicker } from "./DateSolved";
import { Button } from "@/components/ui/button";
import { PlatformDropdown } from "./PlatformDropdown";
import { toast } from "sonner";
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
function TextArea({
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
  const [adding, setAdding] = useState(false);

  // Handle form submission
  const handleAddProblem = async () => {
    if (!problemName.trim()) return toast.error("Problem name is required");
    if (!problemUrl.trim()) return toast.error("Problem URL is required");
    if (!source.trim()) return toast.error("Platform name is required");
    if (!dateSolved) return toast.error("Select a solved date");

    const newProblem = {
      problemName,
      problemUrl,
      difficulty,
      source,
      notes,
      dateSolved: dateSolved ? dateSolved.toISOString() : undefined,
      nextReviewDate: dateSolved
        ? new Date(dateSolved.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
    };

    setAdding(true); // 🔥 disable button immediately

    await toast.promise(
      async () => {
        const res = await fetch("/api/problems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProblem),
        });

        if (!res.ok) {
          setAdding(false); // re-enable on error
          throw new Error("Failed to save");
        }

        const saved = await res.json();

        // Reset inputs
        setProblemName("");
        setProblemUrl("");
        setDifficulty("Easy");
        setSource("");
        setNotes("");
        setDateSolved(undefined);

        setAdding(false); // enable again

        return saved;
      },
      {
        loading: "Adding problem...",
        success: `${problemName} added successfully`,
        error: "Could not add problem",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6 space-y-8 mt-14">
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
        {/* <div className="flex justify-center md:col-span-2 mt-4">
          <Button
            size="lg"
            variant="default"
            className="w-full md:w-1/2"
            onClick={handleAddProblem}
          >
            Add Problem
          </Button>
        </div> */}
        <div className="flex justify-center md:col-span-2 mt-4">
          <Button
            size="lg"
            variant="default"
            disabled={adding}
            onClick={!adding ? handleAddProblem : undefined}
            className="w-full md:w-1/2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                Adding...
              </>
            ) : (
              "Add Problem"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProblemAdditionPage;
