"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import numeral from "numeral";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

type SpendingRow = {
  description: string;
  category: string;
  total: number;
};

type CategoryTotalRow = {
  category: string;
  total: number;
};

const CATEGORY_COLORS = [
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#f59e0b",
  "#d97706",
  "#b45309",
  "#fb7185",
  "#e11d48",
];

function buildConfig(rows: SpendingRow[]) {
  const config: Record<string, { label: string; color: string }> = {
    total: {
      label: "Spent",
      color: "#f97316",
    },
  };

  const seenCategories = Array.from(new Set(rows.map((r) => r.category)));

  seenCategories.forEach((category, index) => {
    config[category] = {
      label: category,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    };
  });

  return config;
}

export function SpendingByDescriptionContent({
  data,
  categoryTotals,
}: {
  data: SpendingRow[];
  categoryTotals: CategoryTotalRow[];
}) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-6 text-center">
        No expense transactions for this period.
      </p>
    );
  }

  const config = buildConfig(data);
  const chartData = data.map((row) => ({
    ...row,
    label:
      row.description.length > 26
        ? `${row.description.slice(0, 26)}...`
        : row.description,
    fill: config[row.category]?.color ?? CATEGORY_COLORS[0],
  }));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold pb-2">Total Expense Per Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryTotals.map((categoryTotal) => (
            <div
              key={categoryTotal.category}
              className="rounded-md border p-3 flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">{categoryTotal.category}</span>
              <span className="font-semibold">
                ${numeral(categoryTotal.total).format("0,0[.]00")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ChartContainer config={config} className="h-90 w-full">
        <BarChart data={chartData} layout="vertical" margin={{ right: 20 }}>
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(value) => `$${numeral(value).format("0,0")}`}
          />
          <YAxis type="category" dataKey="label" width={160} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, _name, item) => {
                  const row = item.payload as SpendingRow;
                  return (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        {row.category}: {row.description}
                      </span>
                      <span className="font-medium">
                        ${numeral(Number(value)).format("0,0[.]00")}
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
          <Bar dataKey="total" radius={4}>
            {chartData.map((entry) => (
              <Cell key={`${entry.category}-${entry.description}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}