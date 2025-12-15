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

interface PlatformDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const PLATFORMS = [
  {
    name: "LeetCode",
    key: "leetcode.com",
    icon: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://leetcode.com&size=64",
  },
  {
    name: "HackerRank",
    key: "hackerrank.com",
    icon: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hackerrank.com&size=64",
  },
  {
    name: "CoderChef",
    key: "coderchef.com",
    icon: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://coderchef.com&size=64",
  },
  {
    name: "GeeksForGeeks",
    key: "geeksforgeeks.org",
    icon: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://geeksforgeeks.org&size=64",
  },
];

export function PlatformDropdown({ value, onChange }: PlatformDropdownProps) {
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
          {value || "Select Your Platform"}
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
          Select your platform
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="dark:bg-[#262626]" />

        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {PLATFORMS.map((p) => (
            <DropdownMenuRadioItem
              key={p.key}
              value={p.key}
              className="
                text-gray-700
                hover:bg-gray-100

                dark:text-[#e5e5e5]
                dark:hover:bg-[#1f1f1f] cursor-pointer
              "
            >
              <div className="flex items-center gap-2">
                <img
                  src={p.icon}
                  alt={`${p.name} icon`}
                  className="w-4 h-4 rounded-sm"
                />
                <span>{p.name}</span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
