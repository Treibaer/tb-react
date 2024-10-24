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
import { AnimatePresence } from "framer-motion";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  return (
    <div>
      <AnimatePresence>
        {isCreating && (
          <FinanceDetailDialogView
            editingEntry={editingEntry}
            tags={data.tags}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
      {editBalance && (
        <FinanceDetailEditBalanceDialogView
          value={balanceInCents}
          onClose={async () => {
            setEditBalance(false);
            await reloadEntries();
          }}
        />
      )}
      </AnimatePresence>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="overflow-auto max-h-[calc(100vh-57px)]">
        <div className="flex flex-col sm:flex-row items-center justify-between me-2">
          <TitleView title="Finances" openDialog={openDialog} />
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="bg-mediumBlue rounded-xl px-3 w-64 py-1 h-10 me-4"
              onChange={handleSearch}
            />
            <div className="text-lg cursor-pointer" onClick={showEditBalance}>
              {(balanceInCents / 100).toFixed(2)}€
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {entries
            .filter((entry) =>
              entry.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((entry) => (
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
