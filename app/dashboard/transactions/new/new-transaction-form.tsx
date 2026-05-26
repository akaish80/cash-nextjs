"use client";

import { createTransaction } from "@/actions/transactionAction";
import TransactionForm, {
  transactionFormSchema,
} from "@/components/transaction-form";
import { Category } from "@/types/Category";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

export default function NewTransactionForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result = await createTransaction({
      amount: data.amount,
      categoryId: data.categoryId,
      description: data.description,
      transactionDate: data.transactionDate.toISOString(),
    });

    if (result.error) {
      toast.error("Failed to create transaction", {
        description: result.message,
        className: "border-red-600 bg-red-500 text-white",
      });
      return;
    }
    toast.success("Transaction created", {
      className: "border-green-300 bg-green-100 text-green-900",
      description: "Your transaction was saved successfully.",
    });
    router.push(
      `/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`,
    );
  };

  return <TransactionForm categories={categories} onSubmit={handleSubmit} />;
}
