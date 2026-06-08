import "server-only";
import { getDb } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, sql, sum } from "drizzle-orm";

export async function getExpenseTotalsByCategory(
  year: number,
  month?: number,
  categoryId?: number,
) {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const db = getDb();

  const rows = await db
    .select({
      category: categoriesTable.name,
      total: sum(transactionsTable.amount),
    })
    .from(transactionsTable)
    .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
    .where(
      and(
        eq(transactionsTable.userId, userId),
        eq(categoriesTable.type, "expense"),
        sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate}) = ${year}`,
        ...(month
          ? [sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate}) = ${month}`]
          : []),
        ...(categoryId
          ? [eq(transactionsTable.categoryId, categoryId)]
          : []),
      ),
    )
    .groupBy(categoriesTable.name)
    .orderBy(desc(sum(transactionsTable.amount)));

  return rows.map((row) => ({
    category: row.category ?? "Unknown",
    total: Number(row.total ?? 0),
  }));
}