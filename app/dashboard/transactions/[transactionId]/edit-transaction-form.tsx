"use client";

import { createTransaction, updateTransaction } from "@/actions/transactionAction";
import TransactionForm, {
  transactionFormSchema,
} from "@/components/transaction-form";
import { type Category } from "@/types/Category";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

export default function EditTransactionForm({
  categories,
  transaction,
}: {
  categories: Category[];
  transaction: {
    id: number;
    amount: string;
    categoryId: number;
    description: string;
    transactionDate: string;
  };
}) {
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result = await  updateTransaction({
      id: transaction.id,
      amount: data.amount,
      description: data.description,
      categoryId: data.categoryId,
      transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
    });

    if (result?.error) {
      toast.error("Failed to update transaction", {
        description: result?.message,
        className: "border-red-600 bg-red-500 text-white",
      });
      return;
    }
    toast.success("Transaction updated", {
      className: "border-green-300 bg-green-100 text-green-900",
      description: "Your transaction was updated successfully.",
    });
    router.push(
      `/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`,
    );
  };

  return (
    <TransactionForm
      categories={categories}
      onSubmit={handleSubmit}
      transaction={{
        amount: Number(transaction.amount),
        categoryId: transaction.categoryId,
        description: transaction.description,
        transactionDate: new Date(transaction.transactionDate),
        transactionType:
          categories.find((category) => category.id === transaction.categoryId)
            ?.type ?? "income",
      }}
    />
  );
}
