import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/getCategories";
import { getExpenseTotalsByCategory } from "@/data/getExpenseTotalsByCategory";
import { getSpendingByDescription } from "@/data/getSpendingByDescription";
import SpendingByDescriptionFilters from "./spending-by-description-filters";
import { SpendingByDescriptionContent } from "./spending-by-description-content";

export default async function SpendingByDescription({
  year,
  categoryId,
  month,
  data,
  categories,
  categoryTotals,
}: {
  year: number;
  categoryId?: number;
  month?: number;
  data?: { description: string; category: string; total: number }[];
  categories?: { id: number; name: string; type: "income" | "expense" }[];
  categoryTotals?: { category: string; total: number }[];
}) {
  const spendingData =
    data ?? (await getSpendingByDescription(year, categoryId, month));
  const availableCategories = categories ?? (await getCategories());
  const availableCategoryTotals =
    categoryTotals ?? (await getExpenseTotalsByCategory(year, month, categoryId));

  const selectedCategory = availableCategories.find(
    (category) => category.id === categoryId,
  );
  const monthLabel = month
    ? new Date(year, month - 1, 1).toLocaleString("default", { month: "long" })
    : "All year";
  const categoryLabel = selectedCategory ? selectedCategory.name : "All categories";

  return (
    <Card className="mb-5 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>
            Spending by Description vs Category ({monthLabel} {year} - {categoryLabel})
          </span>
          <SpendingByDescriptionFilters
            categories={availableCategories}
            categoryId={categoryId}
            month={month}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SpendingByDescriptionContent
          data={spendingData}
          categoryTotals={availableCategoryTotals}
        />
      </CardContent>
    </Card>
  );
}