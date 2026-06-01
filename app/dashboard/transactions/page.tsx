import BreadCrumbComp from "@/components/bread-crumb-comp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactionsByMonth } from "@/data/getTransactionsByMonth";
import { format } from "date-fns";
import Link from "next/link";
import z from "zod";
import Filters from "./filters";
import { getTransactionYearsRange } from "@/data/getTransactionYearRange";
import TableFilters from "./table-filters";

const today = new Date();

const searchSchema = z.object({
  month: z.coerce
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1),
  year: z.coerce
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear() + 1)
    .catch(() => today.getFullYear()),
});

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const searchParamValues = await searchParams;

  const { month, year } = searchSchema.parse(searchParamValues);

  const selectedDate = new Date(year, month - 1);

  const [transactions, yearsRange] = await Promise.all([
    getTransactionsByMonth({ year, month }),
    getTransactionYearsRange(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10  lg:px-8">
      <BreadCrumbComp
        breadcrumbItems={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard/transactions", label: "Transactions" },
        ]}
      />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{format(selectedDate, "MMM yyyy")} Transactions</span>
            <div>
            <Filters year={year} month={month} yearsRange={yearsRange || []} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="ml-auto" variant="default">
            <Link href="/dashboard/transactions/new">New Transaction</Link>
          </Button>

          <TableFilters transactions={transactions ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
