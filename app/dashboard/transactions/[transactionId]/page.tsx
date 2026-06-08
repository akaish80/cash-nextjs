import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/getCategories";
import EditTransactionForm from "./edit-transaction-form";
import { getTransaction } from "@/data/getTransaction";
import { notFound } from "next/navigation";
import DeleteTransactionDialog from "./delete-transaction-dialog";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;

  if (!transactionId || isNaN(Number(transactionId))) {
    notFound();
  }

  const categories = await getCategories();

  const transaction = await getTransaction(Number(transactionId));

  if (!transaction) {
    notFound();
  }

  return (
    <Card className="mt-4 max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Edit Transaction</span>
          {/* <div> */}
          <DeleteTransactionDialog
            transactionId={Number(transactionId)}
            transactionDate={transaction.transactionDate}
          />
          {/* </div> */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditTransactionForm
          categories={categories}
          transaction={transaction}
        />
      </CardContent>
    </Card>
  );
}
