import "server-only";
import { getDb } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, sql, sum } from "drizzle-orm";

export async function getSpendingByDescription(
  year: number,
  categoryId?: number,
  month?: number,
) {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const db = getDb();
  const totalAmount = sum(transactionsTable.amount);

  const rows = await db
    .select({
      description: transactionsTable.description,
      category: categoriesTable.name,
      total: totalAmount,
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
    .groupBy(transactionsTable.description, categoriesTable.name)
    .orderBy(desc(totalAmount))
    .limit(10);

  return rows.map((row) => ({
    description: row.description,
    category: row.category ?? "Unknown",
    total: Number(row.total ?? 0),
  }));
}