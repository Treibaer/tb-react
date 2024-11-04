import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import FinanceEntryContextMenu from "../../components/contextmenu/FinanceEntryContextMenu";
import FinanceDetailDialogView from "../../components/finances/FinanceDetailDialogView";
import FinanceDetailEditBalanceDialogView from "../../components/finances/FinanceDetailEditBalanceDialogView";
import FinanceEntryRow from "../../components/finances/FinanceEntryRow";
import HeaderView from "../../components/HeaderView";
import TitleView from "../../components/TitleView";
import { Breadcrumb } from "../../models/breadcrumb";
import { AccountEntry } from "../../models/finances/account-entry";
import { AcccountTag } from "../../models/finances/account-tag";
import { TicketsContextMenuConfig } from "../../models/tickets-context-menu-config";
import { ROUTES } from "../../routes";
import { FinanceService } from "../../services/FinanceService";
import useIsMobile from "../../hooks/useIsMobile";

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

  const [config, setConfig] = useState<
    TicketsContextMenuConfig & { entry: AccountEntry | null }
  >({
    top: 0,
    left: 0,
    show: false,
    ticket: null,
    entry: null,
  });

  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isMobile]);

  function onContextMenu(e: React.MouseEvent, entry: AccountEntry) {
    e.preventDefault();

    const maxX = window.innerWidth - 175;
    const maxY = window.innerHeight - 175;
    setConfig({
      top: Math.min(e.pageY, maxY),
      left: Math.min(e.pageX, maxX),
      show: true,
      ticket: null,
      entry,
    });
  }

  async function closeContextMenu(shouldUpdate: boolean) {
    setConfig({
      ...config,
      show: false,
      ticket: null,
      entry: null,
    });
    if (shouldUpdate) {
      await reloadEntries();
    }
  }

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

  const handleTouchStart = (event: React.TouchEvent, entry: AccountEntry) => {
    event.preventDefault();
    if (event.touches.length !== 2) {
      return;
    }
    const touch = event.touches[0];
    const touch1 = event.touches[1];
    const touchX = Math.min(touch.clientX, touch1.clientX);
    const touchY = Math.min(touch.clientY, touch1.clientY);
    setConfig({
      top: touchY,
      left: touchX,
      show: true,
      ticket: null,
      entry,
    });
  };

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
          {entries
            .filter((entry) =>
              entry.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((entry) => (
              <div
                className="w-full"
                key={entry.id}
                onTouchStart={(e) => handleTouchStart(e, entry)}
                onClick={() => openEditDialog(entry)}
                onContextMenu={(e) => onContextMenu(e, entry)}
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
