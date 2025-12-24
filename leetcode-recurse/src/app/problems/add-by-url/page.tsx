"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mutate } from "swr";
import { CalendarPicker } from "../add-manually/DateSolved";
import { DifficultyDropdown } from "../add-manually/DifficultyDropdown";

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
  const [dateSolved, setDateSolved] = useState<Date | undefined>();
  const [adding, setAdding] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // ---------------- FETCH DETAILS ----------------
  const fetchProblemDetails = async (url: string) => {
    try {
      setIsFetching(true);

      const res = await fetch("/api/problems/fetchByUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setProblemName(`${data.questionId}. ${data.questionTitle}`);
      setDifficulty(data.difficulty);
      setSource(data.platform);

      toast.success(
        data.cached
          ? "Loaded from cache - some user solved solved this today"
          : "Fetched from LeetCode"
      );
    } catch {
      toast.error("Could not fetch problem details");
    } finally {
      setIsFetching(false);
    }
  };

  // ---------------- ADD PROBLEM ----------------
  const handleAddProblem = async () => {
    if (!problemName.trim()) return toast.error("Problem name is required");
    if (!problemUrl.trim()) return toast.error("Problem URL is required");
    if (!source.trim()) return toast.error("Platform name is required");
    if (!dateSolved) return toast.error("Select a solved date");

    const payload = {
      problemName,
      problemUrl,
      difficulty,
      source,
      notes,
      dateSolved: dateSolved.toISOString(),
    };

    setAdding(true);

    await toast.promise(
      async () => {
        const res = await fetch("/api/problems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error();

        setProblemName("");
        setProblemUrl("");
        setDifficulty("Easy");
        setSource("");
        setNotes("");
        setDateSolved(undefined);

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

    setAdding(false);
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen mt-14 p-6 bg-gray-50 dark:bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#161616] shadow-xl rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <h1 className="md:col-span-2 text-3xl font-bold text-center">
          Add a New Problem using URL
        </h1>

        {/* URL */}
        <div className="flex flex-col">
          <Label className={labelClass}>Problem URL</Label>
          <Input
            type="url"
            value={problemUrl}
            onChange={(e) => setProblemUrl(e.target.value)}
            placeholder="https://leetcode.com/problems/two-sum/"
            className={inputClass}
          />
        </div>

        {/* Fetch */}
        <div className="flex flex-col justify-end">
          <Label className="opacity-0">Fetch</Label>
          <Button
            size="lg"
            className="cursor-pointer"
            disabled={!problemUrl.trim() || isFetching}
            onClick={() => fetchProblemDetails(problemUrl)}
          >
            {isFetching ? "Fetching..." : "Fetch Details"}
          </Button>
        </div>

        {/* Problem Name */}
        <div className="flex flex-col md:col-span-2">
          <Label className={labelClass}>Problem Name</Label>
          <Input
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
            placeholder="Auto-filled or enter manually"
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
          <Label className={labelClass}>Platform</Label>
          <Input value={source} disabled className={inputClass} />
        </div>

        {/* Notes */}
        <div className="flex flex-col md:col-span-2">
          <Label className={labelClass}>Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputClass} resize-none h-32`}
          />
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <Label className={labelClass}>Date Solved</Label>
          <CalendarPicker value={dateSolved} onChange={setDateSolved} />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-center">
          <Button
            size="lg"
            disabled={adding}
            onClick={handleAddProblem}
            className="w-full md:w-1/2"
          >
            {adding ? "Adding..." : "Add Problem"}
          </Button>
        </div>
      </div>
    </div>
  );
}
