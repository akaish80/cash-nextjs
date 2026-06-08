import Cashflow from "./cashFlow";
import CategoryBreakdown from "./category-breakdown";
import RecentTransactions from "./recent-transactions";
import SpendingByDescription from "./spending-by-description";
import { getDashboardData } from "@/data/getDashboardData";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    cfyear: string;
    cbmonth: string;
    sbcategory: string;
    sbmonth: string;
  }>;
}) {
  const today = new Date();
  const searchParamsValues = await searchParams;
  let cfYear = Number(searchParamsValues.cfyear ?? today.getFullYear());
  const cbMonthRaw = Number(searchParamsValues.cbmonth);
  const sbCategoryRaw = Number(searchParamsValues.sbcategory);
  const sbMonthRaw = Number(searchParamsValues.sbmonth);
  const cbMonth =
    !isNaN(cbMonthRaw) && cbMonthRaw >= 1 && cbMonthRaw <= 12
      ? cbMonthRaw
      : undefined;
  const sbCategory = !isNaN(sbCategoryRaw) && sbCategoryRaw > 0 ? sbCategoryRaw : undefined;
  const sbMonth =
    !isNaN(sbMonthRaw) && sbMonthRaw >= 1 && sbMonthRaw <= 12
      ? sbMonthRaw
      : undefined;

  if (isNaN(cfYear)) {
    cfYear = today.getFullYear();
  }

  const dashboardData = await getDashboardData({
    year: cfYear,
    categoryBreakdownMonth: cbMonth,
    spendingCategoryId: sbCategory,
    spendingMonth: sbMonth,
  });

  return (
    <div className="max-w-7xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Cashflow
          year={cfYear}
          cashflow={dashboardData.annualCashflow}
          yearsRange={dashboardData.yearsRange}
        />
        <CategoryBreakdown
          year={cfYear}
          month={cbMonth}
          data={dashboardData.categoryBreakdown}
        />
        <SpendingByDescription
          year={cfYear}
          categoryId={sbCategory}
          month={sbMonth}
          data={dashboardData.spendingByDescription}
          categories={dashboardData.categories}
          categoryTotals={dashboardData.spendingTotalsByCategory}
        />
      </div>
      <RecentTransactions transactions={dashboardData.recentTransactions} />
    </div>
  );
}
