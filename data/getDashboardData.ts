import "server-only";
import { getDb } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, asc, desc, eq, sql } from "drizzle-orm";

export async function getDashboardData({
  year,
  categoryBreakdownMonth,
  spendingCategoryId,
  spendingMonth,
}: {
  year: number;
  categoryBreakdownMonth?: number;
  spendingCategoryId?: number;
  spendingMonth?: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    return {
      annualCashflow: Array.from({ length: 12 }).map((_, index) => ({
        month: index + 1,
        income: 0,
        expenses: 0,
      })),
      yearsRange: [],
      categoryBreakdown: [],
      recentTransactions: [],
      categories: [],
      spendingByDescription: [],
      spendingTotalsByCategory: [],
    };
  }

  const db = getDb();

  const [categories, earliestTransactionRows, recentTransactions, yearlyRows] =
    await Promise.all([
      db.select().from(categoriesTable),
      db
        .select({ transactionDate: transactionsTable.transactionDate })
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId))
        .orderBy(asc(transactionsTable.transactionDate))
        .limit(1),
      db
        .select({
          id: transactionsTable.id,
          description: transactionsTable.description,
          amount: transactionsTable.amount,
          transactionDate: transactionsTable.transactionDate,
          category: categoriesTable.name,
          transactionType: categoriesTable.type,
        })
        .from(transactionsTable)
        .leftJoin(
          categoriesTable,
          eq(transactionsTable.categoryId, categoriesTable.id),
        )
        .where(eq(transactionsTable.userId, userId))
        .orderBy(desc(transactionsTable.transactionDate))
        .limit(5),
      db
        .select({
          amount: transactionsTable.amount,
          description: transactionsTable.description,
          transactionDate: transactionsTable.transactionDate,
          categoryId: transactionsTable.categoryId,
          category: categoriesTable.name,
          transactionType: categoriesTable.type,
        })
        .from(transactionsTable)
        .leftJoin(
          categoriesTable,
          eq(transactionsTable.categoryId, categoriesTable.id),
        )
        .where(
          and(
            eq(transactionsTable.userId, userId),
            sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate}) = ${year}`,
          ),
        ),
    ]);

  const toDate = (dateValue: string) => new Date(`${dateValue}T00:00:00`);

  const annualCashflow = Array.from({ length: 12 }).map((_, index) => ({
    month: index + 1,
    income: 0,
    expenses: 0,
  }));

  const categoryBreakdownMap = new Map<string, number>();
  const spendingDescriptionMap = new Map<string, number>();
  const spendingCategoryTotalsMap = new Map<string, number>();

  for (const row of yearlyRows) {
    const amount = Number(row.amount ?? 0);
    const date = toDate(row.transactionDate);
    const month = date.getMonth() + 1;
    const category = row.category ?? "Unknown";
    const type = row.transactionType as "income" | "expense";

    if (type === "income") {
      annualCashflow[month - 1].income += amount;
    } else {
      annualCashflow[month - 1].expenses += amount;
    }

    if (!categoryBreakdownMonth || categoryBreakdownMonth === month) {
      const categoryBreakdownKey = `${category}__${type}`;
      categoryBreakdownMap.set(
        categoryBreakdownKey,
        (categoryBreakdownMap.get(categoryBreakdownKey) ?? 0) + amount,
      );
    }

    const isExpense = type === "expense";
    const monthMatches = !spendingMonth || spendingMonth === month;
    const categoryMatches = !spendingCategoryId || spendingCategoryId === row.categoryId;

    if (isExpense && monthMatches && categoryMatches) {
      const descriptionKey = `${row.description}__${category}`;
      spendingDescriptionMap.set(
        descriptionKey,
        (spendingDescriptionMap.get(descriptionKey) ?? 0) + amount,
      );
      spendingCategoryTotalsMap.set(
        category,
        (spendingCategoryTotalsMap.get(category) ?? 0) + amount,
      );
    }
  }

  const categoryBreakdown = Array.from(categoryBreakdownMap.entries()).map(
    ([key, total]) => {
      const [category, type] = key.split("__");
      return {
        category,
        type: type as "income" | "expense",
        total,
      };
    },
  );

  const spendingByDescription = Array.from(spendingDescriptionMap.entries())
    .map(([key, total]) => {
      const [description, category] = key.split("__");
      return {
        description,
        category,
        total,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const spendingTotalsByCategory = Array.from(spendingCategoryTotalsMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const today = new Date();
  const currentYear = today.getFullYear();
  const earliestYear = earliestTransactionRows.length
    ? toDate(earliestTransactionRows[0].transactionDate).getFullYear()
    : currentYear;

  const yearsRange = Array.from({
    length: Math.max(1, currentYear - earliestYear + 1),
  }).map((_, i) => currentYear - i);

  return {
    annualCashflow,
    yearsRange,
    categoryBreakdown,
    recentTransactions,
    categories,
    spendingByDescription,
    spendingTotalsByCategory,
  };
}