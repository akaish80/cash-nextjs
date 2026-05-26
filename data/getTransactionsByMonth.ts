import "server-only";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { format } from "date-fns";
// import { and, eq, gte, lte } from "drizzle-orm/sql/expressions/conditions";

export async function getTransactionsByMonth({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const earliestDate = new Date(year, month - 1, 1);
  const latestDate = new Date(year, month, 0);

  const transactions = await db
    .select({
        id: transactionsTable.id,
        amount: transactionsTable.amount,
        description: transactionsTable.description,
        transactionDate: transactionsTable.transactionDate,
        transactionType: categoriesTable.type,
        category: categoriesTable.name,
    })
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.userId, userId),
        gte(
          transactionsTable.transactionDate,
          format(earliestDate, "yyyy-MM-dd"),
        ),
        lte(
          transactionsTable.transactionDate,
          format(latestDate, "yyyy-MM-dd"),
        ),
      ),
    )
    .leftJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id),
    )
    .orderBy(desc(transactionsTable.transactionDate));
  return transactions;
}
