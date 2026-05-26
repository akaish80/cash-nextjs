import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import "server-only";

export async function getTransactionYearsRange() {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  const [earliestTransaction] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, userId))
    .orderBy(asc(transactionsTable.transactionDate))
    .limit(1);

  const today = new Date();
  const currentYear = today.getFullYear();
  const earliestYear = earliestTransaction
    ? new Date(earliestTransaction.transactionDate).getFullYear()
    : currentYear;

  const yearsLength = Math.max(1, currentYear - earliestYear + 1);

  const years = Array.from({ length: yearsLength }).map(
    (_, i) => currentYear - i
  );

  console.log("Transaction years range:", years);

  return years;
}