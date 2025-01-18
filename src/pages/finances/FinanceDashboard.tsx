import { NavLink, useLoaderData } from "react-router-dom";
import FinanceChart from "../../components/finances/FinanceChart";
import FinanceEntryRow from "../../components/finances/FinanceEntryRow";
import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";
import { AccountEntry } from "../../models/finances/account-entry";
import { ROUTES } from "../../routes";
import { FinanceService } from "../../services/financeService";
import DashboardCard from "../../components/finances/FinanceDashboardCard";
import Button from "../../components/Button";

const FinanceDashboard = () => {
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Finances", link: "" },
  ];

  const data = useLoaderData() as {
    recentEntries: AccountEntry[];
    currentIncomeInCents: number;
    currentExpensesInCents: number;
    balanceInCents: number;
    chartValues: number[];
  };

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const expensesInPercent = Math.abs(
    (data.currentExpensesInCents / data.currentIncomeInCents) * 100
  );
  const savingsInPercent = 100 - expensesInPercent;
  const totalSavings =
    (data.currentIncomeInCents + data.currentExpensesInCents) / 100;

  return (
    <div>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex gap-4 items-center justify-center">
        <div className="text-5xl text-center mt-2">Finances</div>
        <NavLink to={ROUTES.FINANCE_SUMMARY}>
          <Button title="Summary" />
        </NavLink>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col sm:flex-row justify-between md:justify-normal gap-2 mx-2">
          <DashboardCard title="Balance" value={data.balanceInCents / 100} />
          <DashboardCard
            title={`Savings ${currentYear}`}
            value={totalSavings}
            valueClass="text-[rgb(30,142,72)]"
          />
        </div>
        <div className="sm:h-72">
          <FinanceChart data={data.chartValues} />
        </div>
        <div className="flex flex-col gap-1 bg-section border border-border rounded-xl mx-1 px-1">
          <div className="flex items-center justify-between">
            <div className="p-4 text-xl">Transactions</div>
            <div className="p-4">
              <NavLink to={ROUTES.FINANCE_DETAILS}>See Details</NavLink>
            </div>
          </div>
          {data.recentEntries.map((entry, index) => (
            <FinanceEntryRow key={index} entry={entry} />
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between md:justify-normal gap-2 m-2">
        <DashboardCard
          title="Income"
          value={data.currentIncomeInCents / currentMonth / 100}
          valueClass="!text-2xl"
        />
        <DashboardCard
          title="Expenses"
          value={Math.abs(data.currentExpensesInCents) / currentMonth / 100}
          subText={`(${expensesInPercent.toFixed(2)}%)`}
          valueClass="!text-2xl"
        />
        <DashboardCard
          title={`Savings (${savingsInPercent.toFixed(2)}%)`}
          value={totalSavings / currentMonth}
          valueClass="!text-2xl"
        />
      </div>
    </div>
  );
};

export default FinanceDashboard;

export const loader = async () => {
  return await FinanceService.shared.getDashboardData();
};
