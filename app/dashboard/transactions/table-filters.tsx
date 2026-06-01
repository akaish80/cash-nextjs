"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";
import { useMemo, useState } from "react";

type Props = {
  transactions: Array<{
    id: number;
    amount: string;
    description: string;
    transactionDate: string;
    transactionType: "income" | "expense" | null;
    category: string | null;
  }>;
};

export default function TableFilters({ transactions }: Props) {
  const [descriptionQuery, setDescriptionQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        transactions
          .map((t) => t.category)
          .filter((category): category is string => Boolean(category)),
      ),
    ).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const descriptionMatch = descriptionQuery
        ? transaction.description
            .toLowerCase()
            .includes(descriptionQuery.toLowerCase())
        : true;

      const typeMatch =
        selectedType === "all"
          ? true
          : transaction.transactionType === selectedType;

      const categoryMatch =
        selectedCategory === "all"
          ? true
          : (transaction.category ?? "Uncategorized") === selectedCategory;

      const dateMatchFrom = fromDate
        ? transaction.transactionDate >= fromDate
        : true;
      const dateMatchTo = toDate ? transaction.transactionDate <= toDate : true;

      return (
        descriptionMatch && typeMatch && categoryMatch && dateMatchFrom && dateMatchTo
      );
    });
  }, [transactions, descriptionQuery, selectedType, selectedCategory, fromDate, toDate]);

  const clearFilters = () => {
    setDescriptionQuery("");
    setSelectedType("all");
    setSelectedCategory("all");
    setFromDate("");
    setToDate("");
  };

  return (
    <>
      <div className="mt-4 rounded-md border p-3">
        <div className="mb-2 text-sm font-semibold text-muted-foreground">Filters</div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <Input
            placeholder="Description"
            value={descriptionQuery}
            onChange={(e) => setDescriptionQuery(e.target.value)}
          />

          <select
            className="h-9 rounded-md border border-input bg-transparent px-2.5 text-sm"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            className="h-9 rounded-md border border-input bg-transparent px-2.5 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            <option value="Uncategorized">Uncategorized</option>
          </select>

          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">
          No transactions found for the selected filters.
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
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.transactionDate + "T00:00:00"), "dd MMM yyyy")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="capitalize">
                  {transaction.transactionType ? (
                    <Badge
                      className={
                        transaction.transactionType === "income"
                          ? "bg-lime-500"
                          : "bg-orange-500"
                      }
                    >
                      {transaction.transactionType}
                    </Badge>
                  ) : (
                    <Badge variant="outline">unknown</Badge>
                  )}
                </TableCell>
                <TableCell>{transaction.category ?? "Uncategorized"}</TableCell>
                <TableCell>${numeral(transaction.amount).format("0,0[.]00")}</TableCell>
                <TableCell>
                  <Button variant="outline" size="icon" aria-label="Edit Transaction">
                    <Link href={`/dashboard/transactions/${transaction.id}`}>
                      <PencilIcon />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
