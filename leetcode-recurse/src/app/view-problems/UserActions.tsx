"use client";

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
import { mutate } from "swr";

// import Details from "../../../public/Details.svg";
// // import Edit from "../../../public/Edit.svg";
// // import Delete from "../../../public/Delete.svg";
// import CheckBox from "../../../public/checkbox.svg";
const EditIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);
const DeleteIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

interface UserActionsProps {
  data: any; // single problem row (datum)
  // onView?: (id: string) => void;
  // onReview?: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function UserActions({ data, onDelete }: UserActionsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* ----------- VIEW DETAILS ------------- */}
      {/* <button
        type="button"
        title="Details"
        className="shrink-0 cursor-pointer"
        onClick={() => onView(data._id)}
      >
        <Image src={Details} width={20} height={20} alt="Details" />
      </button> */}

      {/* ----------- EDIT DETAILS ------------- */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            title="Edit"
            className="shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#161616] transition cursor-pointer "
          >
            {/* <Image src="./Edit.svg" width={18} height={18} alt="Edit" /> */}
            <EditIcon />
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
                _id: data._id,
                problemName: formData.get("problemName"),
                problemUrl: formData.get("problemUrl"),
                difficulty: formData.get("difficulty"),
                source: formData.get("source"),
                notes: formData.get("notes"),
              };

              await fetch("/api/problems/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProblem),
              });
              mutate("/api/dashboard/summary");
              mutate("/api/dashboard/weekly-progress");
              mutate("/api/dashboard/upcoming-reviews");
              mutate("/api/dashboard/recent-activity");

              // location.reload();
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="problemName">Problem Name</Label>
              <Input
                id="problemName"
                name="problemName"
                defaultValue={data.problemName}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="problemUrl">URL</Label>
              <Input
                id="problemUrl"
                name="problemUrl"
                defaultValue={data.problemUrl}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Input
                id="difficulty"
                name="difficulty"
                defaultValue={data.difficulty}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="source">Source</Label>
              <Input id="source" name="source" defaultValue={data.source} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" name="notes" defaultValue={data.notes} />
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-4">
              <DialogClose asChild>
                <button
                  type="button"
                  className="
    px-4 py-2 rounded-lg
    bg-neutral-800 hover:bg-neutral-700
    text-neutral-200
    border border-neutral-700
    transition cursor-pointer"
                >
                  Cancel
                </button>
              </DialogClose>
              <DialogClose asChild>
                <DialogClose asChild>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg      bg-green-600 hover:bg-green-700      text-white transition cursor-pointer
    "
                  >
                    Save changes
                  </button>
                </DialogClose>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------- MARK REVIEWED ------------- */}
      {/* <Dialog>
        <DialogTrigger asChild>
          <button type="button" title="Review" className="shrink-0">
            <Image src={CheckBox} width={20} height={20} alt="Review" />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-xl font-semibold">
            Mark this problem as reviewed?
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            This will update its next review date & progress.
          </DialogDescription>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition">
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                onClick={() => onReview(data._id)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                Review the Problem
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* ----------- DELETE PROBLEM ------------- */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            title="Delete"
            className="shrink-0 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#161616]"
          >
            {/* <Image src="./Delete.svg" width={20} height={20} alt="Delete" /> */}
            <DeleteIcon />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-xl font-semibold dark:text-[#a3a3a3]">
            Do you want to delete this problem?
          </DialogTitle>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <button
                className="
    px-4 py-2 rounded-lg
    bg-neutral-800 hover:bg-neutral-700
    text-neutral-200
    border border-neutral-700
    transition cursor-pointer
  "
              >
                Cancel
              </button>
            </DialogClose>

            <DialogClose asChild>
              <button
                onClick={() => onDelete(data._id)}
                className="
      px-4 py-2 rounded-lg
      bg-red-600 hover:bg-red-700
      text-white
      transition cursor-pointer
    "
              >
                Delete
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
