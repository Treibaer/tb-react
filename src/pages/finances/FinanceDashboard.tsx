import { NavLink, useLoaderData } from "react-router-dom";
import FinanceChart from "../../components/finances/FinanceChart";
import FinanceEntryRow from "../../components/finances/FinanceEntryRow";
import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";
import { AccountEntry } from "../../models/finances/account-entry";
import { ROUTES } from "../../routes";
import { FinanceService } from "../../services/FinanceService";

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

  const m = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const expensesInPercent = Math.abs(
    (data.currentExpensesInCents / data.currentIncomeInCents) * 100
  );
  const savingsInPercent = 100 - expensesInPercent;
  const savings =
    (data.currentIncomeInCents + data.currentExpensesInCents) / 100;

  return (
    <div>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-5xl text-center mt-2">Finances</div>

      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col sm:flex-row justify-between md:justify-normal gap-2 mx-2">
          <div className="flex flex-col p-4 gap-2 bg-mediumBlue rounded-xl hover:bg-hoverBlue cursor-default select-none">
            <div>Current Balance</div>
            <div className="text-4xl">
              {(data.balanceInCents / 100).toFixed(2)}€
            </div>
          </div>
          <div className="flex flex-col p-4 gap-2 bg-mediumBlue rounded-xl hover:bg-hoverBlue cursor-default select-none">
            <div>Savings {currentYear}</div>
            <div className="text-4xl text-[rgb(30,142,72)]">
              {savings.toFixed(2)}€
            </div>
          </div>
        </div>
        <div className="sm:h-72">
          <FinanceChart data={data.chartValues} />
        </div>
        <div className="flex flex-col gap-2 border border-mediumBlue rounded-xl mx-2">
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
        <div className="flex flex-col p-4 gap-2 bg-mediumBlue rounded-xl hover:bg-hoverBlue cursor-default select-none">
          <div>Income</div>
          <div className="text-2xl">
            {(data.currentIncomeInCents / m / 100).toFixed(2)}€
          </div>
        </div>
        <div className="flex flex-col p-4 gap-2 bg-mediumBlue rounded-xl hover:bg-hoverBlue cursor-default select-none">
          <div>Expanses</div>
          <div className="text-2xl">
            {(Math.abs(data.currentExpensesInCents) / m / 100).toFixed(2)}€{" "}
            <span className="text-sm text-gray-400">
              ({expensesInPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex flex-col p-4 gap-2 bg-mediumBlue rounded-xl hover:bg-hoverBlue cursor-default select-none">
          <div>
            Savings{" "}
            <span className="text-sm text-gray-400">
              ({savingsInPercent.toFixed(2)}%)
            </span>
          </div>

          <div className="text-2xl">{(savings / m).toFixed(2)}€</div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;

export const loader = async () => {
  return await FinanceService.shared.getDashboardData();
};
