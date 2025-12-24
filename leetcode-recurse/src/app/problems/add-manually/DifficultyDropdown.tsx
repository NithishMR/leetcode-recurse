"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DifficultyDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function DifficultyDropdown({
  value,
  onChange,
}: DifficultyDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="
            dark:bg-[#121212]
            dark:text-[#e5e5e5]
            dark:border-[#262626]
            dark:hover:bg-[#1f1f1f] cursor-pointer
          "
        >
          {value || "Select Your Difficulty"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="
          w-56
          bg-white border border-gray-200
          dark:bg-[#161616] dark:border-[#262626]
        "
      >
        <DropdownMenuLabel
          className="
            text-gray-700
            dark:text-[#cbd5e1]
          "
        >
          Difficulty
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="dark:bg-[#262626]" />

        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem
            value="easy"
            className="
              text-green-700
              hover:text-green-400
               dark:hover:bg-[#1f1f16f] dark:text-green-300 cursor-pointer
            "
          >
            Easy
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem
            value="medium"
            className="
              text-yellow-700
              hover:text-yellow-400

              dark:text-yellow-300
              dark:hover:bg-[#1f1f16f] cursor-pointer
            "
          >
            Medium
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem
            value="hard"
            className="
              text-red-700
              hover:text-red-500

              dark:text-red-500
              dark:hover:bg-[#1f1f16f] cursor-pointer
            "
          >
            Hard
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
