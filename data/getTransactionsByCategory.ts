import { getDb } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, sql, sum } from "drizzle-orm";
import "server-only";

export async function getTransactionsByCategory(
  year: number,
  month?: number
) {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const db = getDb();

  const conditions = [
    eq(transactionsTable.userId, userId),
    sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate}) = ${year}`,
    ...(month
      ? [sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate}) = ${month}`]
      : []),
  ];

  const rows = await db
    .select({
      category: categoriesTable.name,
      type: categoriesTable.type,
      total: sum(transactionsTable.amount),
    })
    .from(transactionsTable)
    .leftJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id)
    )
    .where(and(...conditions))
    .groupBy(categoriesTable.name, categoriesTable.type);

  return rows.map((row) => ({
    category: row.category ?? "Unknown",
    type: row.type as "income" | "expense",
    total: Number(row.total ?? 0),
  }));
}
