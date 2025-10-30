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
import Image from "next/image";

interface DifficultyDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const PLATFORMS = [
  {
    name: "LeetCode",
    key: "leetcode",
    icon: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://leetcode.com&size=64",
  },
  {
    name: "HackerRank",
    key: "hackerrank",
    icon: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hackerrank.com&size=64",
  },
  {
    name: "CoderChef",
    key: "coderchef",
    icon: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://coderchef.com&size=64",
  },
];

export function PlatformDropdown({ value, onChange }: DifficultyDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {value ? value : "Select Your Difficulty"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select your platform</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {PLATFORMS.map((p) => (
            <DropdownMenuRadioItem key={p.key} value={p.key}>
              <div className="flex items-center gap-2">
                <img src={p.icon} alt="platformm icon" className="w-4 h-4" />
                {p.name}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
