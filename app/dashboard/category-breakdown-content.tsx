"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Legend, Pie, PieChart } from "recharts";

type CategoryRow = {
  category: string;
  type: "income" | "expense";
  total: number;
};

const INCOME_COLORS = [
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
];

const EXPENSE_COLORS = [
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#f59e0b",
  "#d97706",
  "#b45309",
];

function buildConfig(rows: CategoryRow[]) {
  const config: Record<string, { label: string; color: string }> = {};
  const incomeRows = rows.filter((r) => r.type === "income");
  const expenseRows = rows.filter((r) => r.type === "expense");
  incomeRows.forEach((r, i) => {
    config[r.category] = {
      label: r.category,
      color: INCOME_COLORS[i % INCOME_COLORS.length],
    };
  });
  expenseRows.forEach((r, i) => {
    config[r.category] = {
      label: r.category,
      color: EXPENSE_COLORS[i % EXPENSE_COLORS.length],
    };
  });
  return config;
}

export function CategoryBreakdownContent({ data }: { data: CategoryRow[] }) {
  const config = buildConfig(data);
  const incomeData = data
    .filter((r) => r.type === "income")
    .map((entry) => ({
      ...entry,
      fill: config[entry.category]?.color,
    }));
  const expenseData = data
    .filter((r) => r.type === "expense")
    .map((entry) => ({
      ...entry,
      fill: config[entry.category]?.color,
    }));

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-6 text-center">
        No transactions for this period.
      </p>
    );
  }

  const formatAmount = (value: unknown) =>
    `$${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Legend labels */}
      <div className="flex gap-6 text-sm font-semibold">
        <span className="text-lime-500">Inner ring — Income</span>
        <span className="text-orange-500">Outer ring — Expenses</span>
      </div>

      <ChartContainer config={config} className="h-80 w-full">
        <PieChart>
          {/* Inner ring: income */}
          {incomeData.length > 0 && (
            <Pie
              data={incomeData}
              dataKey="total"
              nameKey="category"
              cx="38%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              label={false}
            />
          )}

          {/* Outer ring: expenses */}
          {expenseData.length > 0 && (
            <Pie
              data={expenseData}
              dataKey="total"
              nameKey="category"
              cx="38%"
              cy="50%"
              innerRadius={110}
              outerRadius={160}
              label={false}
            />
          )}

          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => `${formatAmount(value)} ${name}`}
              />
            }
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            formatter={(value) => (
              <span className="text-primary text-xs">{value}</span>
            )}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
