import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/getCategories";
import { getSpendingByDescription } from "@/data/getSpendingByDescription";
import SpendingByDescriptionFilters from "./spending-by-description-filters";
import { SpendingByDescriptionContent } from "./spending-by-description-content";

export default async function SpendingByDescription({
  year,
  categoryId,
  month,
}: {
  year: number;
  categoryId?: number;
  month?: number;
}) {
  const [data, categories] = await Promise.all([
    getSpendingByDescription(year, categoryId, month),
    getCategories(),
  ]);
  const selectedCategory = categories.find((category) => category.id === categoryId);
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
            categories={categories}
            categoryId={categoryId}
            month={month}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SpendingByDescriptionContent data={data} />
      </CardContent>
    </Card>
  );
}