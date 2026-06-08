import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/getCategories";
import NewTransactionForm from "./new-transaction-form";
import BreadCrumbComp from "@/components/bread-crumb-comp";

export default async function NewTransactionPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="max-w-7xl mx-auto py-10">
        <BreadCrumbComp
          breadcrumbItems={[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/dashboard/transactions", label: "Transactions" },
            { href: "",  label: "New Transaction" },
          ]}
        />
        <Card className="mt-4 max-w-3xl">
          <CardHeader>
            <CardTitle>New Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <NewTransactionForm categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
