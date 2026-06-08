import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactionsByCategory } from "@/data/getTransactionsByCategory";
import { CategoryBreakdownContent } from "./category-breakdown-content";
import CategoryBreakdownFilters from "./category-breakdown-filters";
// import CategoryBreakdownFilters from "./category-breakdown-filters";

export default async function CategoryBreakdown({
  year,
  month,
  data,
}: {
  year: number;
  month?: number;
  data?: { category: string; type: "income" | "expense"; total: number }[];
}) {
  const categoryData = data ?? (await getTransactionsByCategory(year, month));
  const title = month
    ? `${new Date(year, month - 1, 1).toLocaleString("default", { month: "long" })} ${year} — by Category`
    : `${year} — by Category`;

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Transactions {title}</span>
          <CategoryBreakdownFilters month={month} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CategoryBreakdownContent data={categoryData} />
      </CardContent>
    </Card>
  );
}
