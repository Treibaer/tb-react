import { NavLink, useLoaderData } from "react-router-dom";
import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";
import { ROUTES } from "../../routes";
import FinanceEntryRow from "../../components/finances/FinanceEntryRow";
import { FinanceService } from "../../services/FinanceService";
import { AccountEntry } from "../../models/finances/account-entry";

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
  };

  return (
    <div>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-5xl text-center mt-2">Finances</div>
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col sm:flex-row justify-between md:justify-normal gap-4 mx-2">
          <div className="flex flex-col p-4 gap-2 bg-mediumBlue rounded-xl hover:bg-hoverBlue cursor-default select-none">
            <div>Current Balance</div>
            <div className="text-4xl">
              {(data.balanceInCents / 100).toFixed(2)}€
            </div>
          </div>
          <div className="flex flex-col p-4 gap-2 bg-mediumBlue rounded-xl hover:bg-hoverBlue cursor-default select-none">
            <div>Income</div>
            <div className="text-4xl">
              {(data.currentIncomeInCents / 100).toFixed(2)}€
            </div>
          </div>
          <div className="flex flex-col p-4 gap-2 bg-mediumBlue rounded-xl hover:bg-hoverBlue cursor-default select-none">
            <div>Expenses</div>
            <div className="text-4xl">
              {(Math.abs(data.currentExpensesInCents) / 100).toFixed(2)}€
            </div>
          </div>
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
    </div>
  );
};

export default FinanceDashboard;

export const loader = async ({ request }: any) => {
  return await FinanceService.shared.getDashboardData();
};
