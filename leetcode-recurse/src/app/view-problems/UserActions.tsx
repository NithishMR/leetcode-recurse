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

import Details from "../../../public/Details.svg";
import Edit from "../../../public/Edit.svg";
import Delete from "../../../public/Delete.svg";
import CheckBox from "../../../public/checkbox.svg";

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
            className="shrink-0 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <Image src={Edit} width={18} height={18} alt="Edit" />
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
                id: data._id,
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

              location.reload();
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
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
                >
                  Cancel
                </button>
              </DialogClose>
              <DialogClose asChild>
                <DialogClose asChild>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
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
          <button type="button" title="Delete" className="shrink-0">
            <Image src={Delete} width={20} height={20} alt="Delete" />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-xl font-semibold">
            Do you want to delete this problem?
          </DialogTitle>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition">
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                onClick={() => onDelete(data._id)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
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
