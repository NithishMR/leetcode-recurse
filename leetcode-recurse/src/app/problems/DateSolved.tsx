"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CalendarPickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onChange) onChange(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer ">
        <Button
          variant="outline"
          className={cn(
            "w-60 pl-3 text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
