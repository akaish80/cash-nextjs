"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: format(new Date(2000, i, 1), "MMMM"),
}));

const MONTH_LABELS = Object.fromEntries(MONTHS.map((month) => [month.value, month.label]));

type Props = {
  year: number;
  month?: number;
};

export default function CategoryBreakdownFilters({ year, month }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function buildUrl(cbmonth: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (cbmonth) {
      params.set("cbmonth", cbmonth);
    } else {
      params.delete("cbmonth");
    }
    return `/dashboard?${params.toString()}`;
  }

  return (
    <Select
      value={month ? String(month) : "all"}
      onValueChange={(value) => {
        router.push(buildUrl(value === "all" ? null : value));
      }}
    >
      <SelectTrigger className="w-36">
        <SelectValue>
          {(value) => {
            if (!value || value === "all") {
              return "All year";
            }

            return MONTH_LABELS[String(value)] ?? String(value);
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All year</SelectItem>
        {MONTHS.map((m) => (
          <SelectItem key={m.value} value={m.value}>
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
