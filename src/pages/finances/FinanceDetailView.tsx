import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import FinanceEntryContextMenu from "../../components/contextmenu/FinanceEntryContextMenu";
import FinanceDetailDialogView from "../../components/finances/FinanceDetailDialogView";
import FinanceDetailEditBalanceDialogView from "../../components/finances/FinanceDetailEditBalanceDialogView";
import FinanceEntryRow from "../../components/finances/FinanceEntryRow";
import HeaderView from "../../components/HeaderView";
import TitleView from "../../components/TitleView";
import useContextMenu from "../../hooks/useContextMenu";
import useIsMobile from "../../hooks/useIsMobile";
import { Breadcrumb } from "../../models/breadcrumb";
import { AccountEntry } from "../../models/finances/account-entry";
import { AcccountTag } from "../../models/finances/account-tag";
import { ROUTES } from "../../routes";
import { FinanceService } from "../../services/financeService";

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

  const isMobile = useIsMobile();
  const [entries, setEntries] = useState<AccountEntry[]>(data.entries);
  const [balanceInCents, setBalanceInCents] = useState(data.balanceInCents);
  const [isCreating, setIsCreating] = useState(false);
  const [editBalance, setEditBalance] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AccountEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isMobile]);

  const { config, openContextMenu, openContextMenuTouch, closeContextMenu } =
    useContextMenu({ refresh });

  function openDialog() {
    setIsCreating(true);
  }

  async function refresh() {
    const data = await FinanceService.shared.getAccountEntries();
    setEntries(data.entries);
    setBalanceInCents(data.balanceInCents);
  }

  async function openEditDialog(accountEntry: AccountEntry) {
    setEditingEntry(accountEntry);
    setIsCreating(true);
  }

  async function createSimilar(entry: AccountEntry) {
    setIsCreating(true);
    setEditingEntry({
      ...entry,
      id: 0,
      createdAt: 0,
      purchasedAt: Math.floor(Date.now() / 1000),
    });
  }

  function showEditBalance() {
    setEditBalance(true);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AnimatePresence>
        {isCreating && (
          <FinanceDetailDialogView
            editingEntry={editingEntry}
            tags={data.tags}
            onClose={async (reload) => {
              setIsCreating(false);
              setEditingEntry(null);
              if (reload) await refresh();
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editBalance && (
          <FinanceDetailEditBalanceDialogView
            value={balanceInCents}
            onClose={async () => {
              setEditBalance(false);
              await refresh();
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {config.show && (
          <FinanceEntryContextMenu
            config={config}
            onClose={closeContextMenu}
            onCreateSimilar={createSimilar}
          />
        )}
      </AnimatePresence>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="overflow-auto max-h-[calc(100vh-57px)] mx-2">
        <div className="flex flex-col sm:flex-row items-center justify-between me-2">
          <TitleView title="Finances" openDialog={openDialog} />
          <div className="flex items-center">
            <input
              type="text"
              ref={inputRef}
              placeholder="Search"
              className="bg-row rounded-xl border-border border px-3 w-64 py-1 h-10 me-4"
              onChange={handleSearch}
            />
            <div className="text-lg cursor-pointer" onClick={showEditBalance}>
              {(balanceInCents / 100).toFixed(2)}€
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {filteredEntries.map((entry) => (
            <div
              className="w-full"
              key={entry.id}
              onTouchStart={(e) => openContextMenuTouch(e, entry)}
              onClick={() => openEditDialog(entry)}
              onContextMenu={(e) => openContextMenu(e, entry)}
            >
              <FinanceEntryRow entry={entry} />
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
