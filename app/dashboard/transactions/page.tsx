import BreadCrumbComp from "@/components/bread-crumb-comp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactionsByMonth } from "@/data/getTransactionsByMonth";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import z from "zod";
import numeral from "numeral";
import { Badge } from "@/components/ui/badge";
import Filters from "./filters";
import { getTransactionYearsRange } from "@/data/getTransactionYearRange";

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

  const transactions = await getTransactionsByMonth({ year, month });

  const yearsRange = await getTransactionYearsRange();

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

          {transactions?.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">
              No transactions found for this month.
            </p>
          ) : (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(
                        new Date(transaction.transactionDate),
                        "dd MMM yyyy",
                      )}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="capitalize">
                      <Badge
                        className={
                          transaction.transactionType === "income"
                            ? "bg-lime-500"
                            : "bg-orange-500"
                        }
                      >
                        {transaction.transactionType}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      ${numeral(transaction.amount).format("0,0[.]00")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Edit Transaction"
                      >
                        <Link
                          href={`/dashboard/transactions/${transaction.id}`}
                        >
                          <PencilIcon />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
