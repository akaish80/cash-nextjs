"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export default function Filters({
  year,
  month,
  yearsRange,
}: {
  year: number;
  month: number;
  yearsRange: number[];
}) {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  return (
    <div className="flex gap-1">
      <Select
        value={format(new Date(selectedYear, selectedMonth - 1, 1), "MMM")}
        onValueChange={(value) => setSelectedMonth(Number(value))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, (_, i) => i).map((m) => (
            <SelectItem key={m} value={`${m + 1}`}>
              {format(new Date(selectedYear, m, 1), "MMM")}{" "}
              {/* Display month name */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(selectedYear)}
        onValueChange={(value) => setSelectedYear(Number(value))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {yearsRange.map((y) => (
            <SelectItem key={y} value={`${y}`}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="default">
        <Link
          href={`/dashboard/transactions?month=${selectedMonth}&year=${selectedYear}`}
        >
          Go
        </Link>
      </Button>
    </div>
  );
}
