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
import { mutate } from "swr";

const inputClass = `
  bg-white text-gray-800 border border-gray-300
  dark:bg-[#121212] dark:text-[#e5e5e5] dark:border-[#262626]
  dark:placeholder-[#737373]
  focus:ring-2 focus:ring-blue-500
`;

const labelClass = `
  mb-1 font-medium
  text-gray-700
  dark:text-[#cbd5e1]
`;

export default function ProblemAdditionPage() {
  const [problemName, setProblemName] = useState("");
  const [problemUrl, setProblemUrl] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [dateSolved, setDateSolved] = useState<Date | undefined>(undefined);
  const [adding, setAdding] = useState(false);

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
      dateSolved: dateSolved.toISOString(),
      nextReviewDate: new Date(
        dateSolved.getTime() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    setAdding(true);

    await toast.promise(
      async () => {
        const res = await fetch("/api/problems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProblem),
        });

        if (!res.ok) {
          setAdding(false);
          throw new Error("Failed to save");
        }

        setProblemName("");
        setProblemUrl("");
        setDifficulty("Easy");
        setSource("");
        setNotes("");
        setDateSolved(undefined);

        setAdding(false);
        mutate("/api/dashboard/summary");
        mutate("/api/dashboard/weekly-progress");
        mutate("/api/dashboard/upcoming-reviews");
        mutate("/api/dashboard/recent-activity");
      },
      {
        loading: "Adding problem...",
        success: "Problem added successfully",
        error: "Could not add problem",
      }
    );
  };

  return (
    <div className="min-h-screen mt-14 p-6 bg-gray-50 dark:bg-[#0d0d0d]">
      <div
        className="
          max-w-4xl mx-auto
          bg-white shadow-xl rounded-2xl p-8
          grid grid-cols-1 md:grid-cols-2 gap-6
          dark:bg-[#161616] dark:border dark:border-[#262626] dark:shadow-none
        "
      >
        <h1
          className="
            col-span-1 md:col-span-2
            text-3xl font-bold text-center mb-6
            text-gray-800
            dark:text-[#e5e5e5]
          "
        >
          Add a New Problem
        </h1>

        {/* Problem Name */}
        <div className="flex flex-col">
          <Label className={labelClass}>Problem Name</Label>
          <Input
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
            placeholder="Example: Two Sum"
            className={inputClass}
          />
        </div>

        {/* Problem URL */}
        <div className="flex flex-col">
          <Label className={labelClass}>Problem URL</Label>
          <Input
            type="url"
            value={problemUrl}
            onChange={(e) => setProblemUrl(e.target.value)}
            placeholder="https://example.com"
            className={inputClass}
          />
        </div>

        {/* Difficulty */}
        <div className="flex flex-col">
          <Label className={labelClass}>Difficulty</Label>
          <DifficultyDropdown value={difficulty} onChange={setDifficulty} />
        </div>

        {/* Platform */}
        <div className="flex flex-col">
          <Label className={labelClass}>Platform Name</Label>
          <PlatformDropdown value={source} onChange={setSource} />
        </div>

        {/* Notes */}
        <div className="flex flex-col md:col-span-2">
          <Label className={labelClass}>Notes / Key Trick</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes or key trick..."
            className={`${inputClass} resize-none h-32`}
          />
        </div>

        {/* Date Solved */}
        <div className="flex flex-col">
          <Label className={labelClass}>Date Solved</Label>
          <CalendarPicker value={dateSolved} onChange={setDateSolved} />
        </div>

        {/* Submit */}
        <div className="flex justify-center md:col-span-2 mt-4">
          <Button
            size="lg"
            disabled={adding}
            onClick={!adding ? handleAddProblem : undefined}
            className="
              w-full md:w-1/2
              flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            "
          >
            {adding ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
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
}
