import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import FinanceDetailDialogView from "../../components/finances/FinanceDetailDialogView";
import FinanceDetailEditBalanceDialogView from "../../components/finances/FinanceDetailEditBalanceDialogView";
import FinanceEntryRow from "../../components/finances/FinanceEntryRow";
import HeaderView from "../../components/HeaderView";
import TitleView from "../../components/TitleView";
import { Breadcrumb } from "../../models/breadcrumb";
import { AccountEntry } from "../../models/finances/account-entry";
import { AcccountTag } from "../../models/finances/account-tag";
import { ROUTES } from "../../routes";
import { FinanceService } from "../../services/FinanceService";

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
        <div className="flex items-center justify-between me-2">
          <TitleView title="Finances" openDialog={openDialog} />
          <div className="text-lg cursor-pointer" onClick={showEditBalance}>
            {(balanceInCents / 100).toFixed(2)}€
          </div>
        </div>
        <div className="flex flex-col items-center">
          {entries.map((entry) => (
            <FinanceEntryRow
              key={entry.id}
              entry={entry}
              onClick={() => openEditDialog(entry)}
            />
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
