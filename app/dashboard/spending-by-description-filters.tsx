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

type Props = {
  categories: { id: number; name: string; type: "income" | "expense" }[];
  categoryId?: number;
  month?: number;
};

const ALL_VALUE = "all";
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: format(new Date(2000, i, 1), "MMMM"),
}));
const MONTH_LABELS = Object.fromEntries(
  MONTHS.map((month) => [month.value, month.label]),
);

export default function SpendingByDescriptionFilters({
  categories,
  categoryId,
  month,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function buildUrl({
    sbcategory,
    sbmonth,
  }: {
    sbcategory?: string | null;
    sbmonth?: string | null;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    if (sbcategory !== undefined) {
      if (sbcategory) {
        params.set("sbcategory", sbcategory);
      } else {
        params.delete("sbcategory");
      }
    }

    if (sbmonth !== undefined) {
      if (sbmonth) {
        params.set("sbmonth", sbmonth);
      } else {
        params.delete("sbmonth");
      }
    }

    return `/dashboard?${params.toString()}`;
  }

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const labels = Object.fromEntries(
    expenseCategories.map((category) => [String(category.id), category.name]),
  );

  return (
    <div className="flex items-center gap-2">
      <Select
        value={month ? String(month) : ALL_VALUE}
        onValueChange={(value) => {
          router.push(
            buildUrl({ sbmonth: value === ALL_VALUE ? null : value }),
          );
        }}
      >
        <SelectTrigger className="w-36">
          <SelectValue>
            {(value) => {
              if (!value || value === ALL_VALUE) {
                return "All year";
              }

              return MONTH_LABELS[String(value)] ?? String(value);
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All year</SelectItem>
          {MONTHS.map((monthItem) => (
            <SelectItem key={monthItem.value} value={monthItem.value}>
              {monthItem.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={categoryId ? String(categoryId) : ALL_VALUE}
        onValueChange={(value) => {
          router.push(
            buildUrl({ sbcategory: value === ALL_VALUE ? null : value }),
          );
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue>
            {(value) => {
              if (!value || value === ALL_VALUE) {
                return "All categories";
              }

              return labels[String(value)] ?? String(value);
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All categories</SelectItem>
          {expenseCategories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}