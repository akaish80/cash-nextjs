import Cashflow from "./cashFlow";
import CategoryBreakdown from "./category-breakdown";
import RecentTransactions from "./recent-transactions";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ cfyear: string; cbmonth: string }>;
}) {
  const today = new Date();
  const searchParamsValues = await searchParams;
  let cfYear = Number(searchParamsValues.cfyear ?? today.getFullYear());
  const cbMonthRaw = Number(searchParamsValues.cbmonth);
  const cbMonth =
    !isNaN(cbMonthRaw) && cbMonthRaw >= 1 && cbMonthRaw <= 12
      ? cbMonthRaw
      : undefined;

  if (isNaN(cfYear)) {
    cfYear = today.getFullYear();
  }

  return (
    <div className="max-w-7xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <Cashflow year={cfYear} />
      <CategoryBreakdown year={cfYear} month={cbMonth} />
      <RecentTransactions />
    </div>
  );
}