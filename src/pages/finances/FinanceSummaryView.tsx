import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";
import {
  FinanceSummary,
  FinanceTagEntry,
} from "../../models/finances/finance-summary";
import { ROUTES } from "../../routes";
import { FinanceService } from "../../services/FinanceService";
import Col from "./Col";

const FinanceSummaryView = () => {
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Finances", link: "" },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  const summary = useLoaderData() as FinanceSummary;
  const currentMonth = new Date().getMonth() + 1;
  const sum = (a: number, b: number) => a + b;
  const percentage = (a: number, b: number) =>
    ((100 * Math.abs(a)) / b).toFixed(2);
  const incomingTotal = summary.incoming.reduce(sum, 0);
  const expensesTotal = summary.expenses.reduce(sum, 0);
  const expensesPercentage = `(${percentage(expensesTotal, incomingTotal)}%)`;
  const balanceTotal = summary.balance.reduce(sum, 0);
  const balancePercentage = `(${percentage(balanceTotal, incomingTotal)}%)`;

  const year =
    new URLSearchParams(location.search).get("year") ??
    new Date().getFullYear();

  return (
    <div>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex items-center gap-8">
        <div className="text-3xl text-center m-2">Summary</div>
        <select
          className="bg-slate-800 text-white rounded-md p-2"
          onChange={(event) => {
            console.log(event.target.value);
            navigate(`/finances/summary?year=${event.target.value}`);
          }}
          value={Number(year)}
        >
          {Array.from(
            { length: new Date().getFullYear() - 2016 + 2 },
            (_, i) => (
              <option key={2016 + i} value={2016 + i}>
                {2016 + i}
              </option>
            )
          )}
        </select>
      </div>
      <table className="bg-slate-800 min-w-full table-fixed text-center">
        <thead>
          <tr className="font-semibold">
            {[
              "Tag",
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
              "Average",
              "Total",
            ].map((month: string) => (
              <td key={month}>{month.substring(0, 3)}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {summary.byTag.map((month: FinanceTagEntry) => (
            <tr key={month.name} className="bg-[#b69367]">
              <Col>{month.name}</Col>
              {month.byMonth.map((value: number, index: number) => (
                <Col key={index}>{value}</Col>
              ))}
              <Col>{month.average}</Col>
              <Col>{month.total}</Col>
            </tr>
          ))}
          <tr className="bg-[#316241]">
            <Col>Incoming</Col>
            {summary.incoming.map((v: number, i: number) => (
              <Col key={i}>{v}</Col>
            ))}
            <Col>
              {summary.incoming.reduce((a: number, b: number) => a + b, 0) /
                currentMonth}
            </Col>
            <Col>
              {summary.incoming.reduce((a: number, b: number) => a + b, 0)}
            </Col>
          </tr>
          <tr className="bg-[#813550]">
            <Col>Expenses</Col>
            {summary.expenses.map((v: number, index: number) => (
              <Col key={index}>
                <div>{Math.abs(v / 100).toFixed(2)}€</div>
                {v !== 0 && (
                  <div>
                    (
                    {((100 * Math.abs(v)) / summary.incoming[index]).toFixed(2)}
                    %)
                  </div>
                )}
              </Col>
            ))}
            <Col>
              <div>
                {(Math.abs(expensesTotal / 100) / currentMonth).toFixed(2)}€
              </div>
              {expensesTotal !== 0 && <div>{expensesPercentage}</div>}
            </Col>
            <Col>
              <div>{Math.abs(expensesTotal / 100).toFixed(2)}€</div>
              {expensesTotal !== 0 && <div>{expensesPercentage}</div>}
            </Col>
          </tr>
          <tr className="bg-[#1f2e40]">
            <Col>Balance</Col>
            {summary.balance.map((v: number, index: number) => (
              <Col key={index}>
                <div>{(v / 100).toFixed(2)}€</div>
                {v !== 0 && (
                  <div>
                    ({((100 * v) / summary.incoming[index]).toFixed(2)}
                    %)
                  </div>
                )}
              </Col>
            ))}
            <Col absolute={false}>
              <div>{(balanceTotal / 100 / currentMonth).toFixed(2)}€</div>
              {balanceTotal !== 0 && <div>{balancePercentage}</div>}
            </Col>
            <Col absolute={false}>
              <div>{(balanceTotal / 100).toFixed(2)}€</div>
              {balanceTotal !== 0 && <div>{balancePercentage}</div>}
            </Col>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinanceSummaryView;

export const loader = async ({ request }: any) => {
  const queryParameters = new URL(request.url).searchParams;
  const year = queryParameters.get("year") ?? new Date().getFullYear();
  return await FinanceService.shared.getAccountSummary(Number(year));
};
