"use server";

import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { addDays, subYears } from "date-fns";
import { and, eq } from "drizzle-orm";
import z from "zod";



const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  categoryId: z.coerce.number().positive("Category ID is invalid"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(300, "Description must contain at maximum of 300 characters"),
  transactionDate: z.coerce
    .date()
    .min(subYears(new Date(), 100))
    .max(addDays(new Date(), 1), "Transaction date cannot be in the future"),
});


const updateTransactionSchema = transactionSchema.and(
  z.object({
    id: z.number(),
  })
);

export const createTransaction = async (data: {
  amount: number;
  categoryId: number;
  description: string;
  transactionDate: string;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }
  const validation = transactionSchema.safeParse(data);
  console.log("Validation result:", validation);
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      userId,
      amount: data.amount.toString(),
      categoryId: data.categoryId,
      description: data.description,
      transactionDate: data.transactionDate,
    })
    .returning();

  return {
    error: false,
    id: transaction.id,
  };
};


export async function updateTransaction(data: {
  id: number;
  transactionDate: string;
  description: string;
  amount: number;
  categoryId: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const validation = updateTransactionSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

  await db
    .update(transactionsTable)
    .set({
      description: data.description,
      amount: data.amount.toString(),
      transactionDate: data.transactionDate,
      categoryId: data.categoryId,
    })
    .where(
      and(
        eq(transactionsTable.id, data.id),
        eq(transactionsTable.userId, userId)
      )
    );
}

export async function deleteTransaction(transactionId: number) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  await db
    .delete(transactionsTable)
    .where(
      and(
        eq(transactionsTable.id, transactionId),
        eq(transactionsTable.userId, userId)
      )
    );
}