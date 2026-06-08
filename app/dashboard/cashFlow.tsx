import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CashflowFilters from "./cashflow-filters";
import { CashflowContent } from "./cashFlowContent";
import { getTransactionYearsRange } from "@/data/getTransactionYearRange";
import { getAnnualCashflow } from "@/data/getAnnualCashFlow";

export default async function Cashflow({
  year,
  cashflow,
  yearsRange,
}: {
  year: number;
  cashflow?: { month: number; income: number; expenses: number }[];
  yearsRange?: number[];
}) {
  const annualCashflow = cashflow ?? (await getAnnualCashflow(year));
  const availableYearsRange = yearsRange ?? (await getTransactionYearsRange());

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
          <CashflowFilters year={year} yearsRange={availableYearsRange} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CashflowContent annualCashflow={annualCashflow} />
      </CardContent>
    </Card>
  );
}