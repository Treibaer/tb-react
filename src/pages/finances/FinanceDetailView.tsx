import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import FinanceDetailDialogView from "../../components/finances/FinanceDetailDialogView";
import FinanceDetailEditBalanceDialogView from "../../components/finances/FinanceDetailEditBalanceDialogView";
import HeaderView from "../../components/HeaderView";
import TitleView from "../../components/TitleView";
import { Breadcrumb } from "../../models/breadcrumb";
import { AccountEntry } from "../../models/finances/account-entry";
import { AcccountTag } from "../../models/finances/account-tag";
import { ROUTES } from "../../routes";
import { FinanceService } from "../../services/FinanceService";
import { FormatType, formatUnixTimestamp } from "../../utils/dataUtils";

const FinanceDetailView = () => {
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Finances", link: ROUTES.FINANCE_DASHBOARD },
    { title: "Details", link: "" },
  ];

  const data = useLoaderData() as {
    entries: AccountEntry[];
    tags: AcccountTag[];
    balanceInCents: number;
  };

  const [entries, setEntries] = useState<AccountEntry[]>(data.entries);
  const [balanceInCents, setBalanceInCents] = useState(data.balanceInCents);
  const [isCreating, setIsCreating] = useState(false);
  const [editBalance, setEditBalance] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AccountEntry | null>(null);

  function openDialog() {
    setIsCreating(true);
  }

  async function onClose(reload: boolean) {
    if (reload) {
      await reloadEntries();
    }
    setIsCreating(false);
    setEditingEntry(null);
  }

  async function reloadEntries() {
    const data = await FinanceService.shared.getAccountEntries();
    setEntries(data.entries);
    setBalanceInCents(data.balanceInCents);
  }

  async function openEditDialog(accountEntry: AccountEntry) {
    setEditingEntry(accountEntry);
    setIsCreating(true);
  }

  function showEditBalance() {
    setEditBalance(true);
  }

  return (
    <div>
      {isCreating && (
        <FinanceDetailDialogView
          editingEntry={editingEntry}
          tags={data.tags}
          onClose={onClose}
        />
      )}
      {editBalance && (
        <FinanceDetailEditBalanceDialogView
          value={balanceInCents}
          onClose={async () => {
            setEditBalance(false);
            await reloadEntries();
          }}
        />
      )}
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="overflow-auto max-h-[calc(100vh-57px)]">
        <div className="flex items-center justify-between me-8">
          <TitleView title="Finances" openDialog={openDialog} />
          <div className="text-lg cursor-pointer" onClick={showEditBalance}>
            {(balanceInCents / 100).toFixed(2)}€
          </div>
        </div>
        <div className="flex flex-col items-center">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => openEditDialog(entry)}
              className="flex cursor-pointer gap-4 justify-between w-full border-b border-b-[rgb(37,38,50)] p-2 items-center bg:[rgb(25,26,35)] hover:bg-[rgb(28,29,42)]"
            >
              <div className="text-gray-500">
                {formatUnixTimestamp(entry.purchasedAt, FormatType.DAY)}
              </div>
              <div className="w-1">{entry.icon}</div>

              <div
                className={`
                ${entry.valueInCents < 0 ? "text-stone-500" : "text-green-700"}
                text-end w-20
                `}
              >
                {(entry.valueInCents / 100).toFixed(2)}€
              </div>

              <div className="flex-1">{entry.title}</div>
              <div className="me-4 py-1 px-2 text-slate-400 text-sm rounded-lg border border-[rgb(133,134,153)]">
                {entry.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceDetailView;

export const loader = async ({ request }: any) => {
  const queryParameters = new URL(request.url).searchParams;
  const tag = queryParameters.get("tag")
    ? Number(queryParameters.get("tag"))
    : undefined;
  const dateFrom = queryParameters.get("dateFrom") ?? undefined;
  const dateTo = queryParameters.get("dateTo") ?? undefined;
  const type = queryParameters.get("type") ?? undefined;
  return await FinanceService.shared.getAccountEntries({
    tag,
    dateFrom,
    dateTo,
    type,
  });
};
