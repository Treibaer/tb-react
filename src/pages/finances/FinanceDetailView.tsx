import { useLoaderData } from "react-router-dom";
import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";
import { ROUTES } from "../../routes";
import { FinanceService } from "../../services/FinanceService";
import { AccountEntry } from "../../models/finances/account-entry";
import { FormatType, formatUnixTimestamp } from "../../utils/dataUtils";
import TitleView from "../../components/TitleView";
import React, { useRef, useState } from "react";
import Dialog from "../../components/common/Dialog";
import { AcccountTag } from "../../models/finances/account-tag";

const FinanceDetailView = () => {
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Finances", link: ROUTES.FINANCE_DASHBOARD },
    { title: "Details", link: ROUTES.FINANCE_DETAILS },
  ];

  const data = useLoaderData() as {
    entries: AccountEntry[];
    tags: AcccountTag[];
    balanceInCents: number;
  };
  const tags = data.tags;

  const titleRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const signRef = useRef<HTMLSelectElement>(null);
  const purchasedATRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLSelectElement>(null);

  const [editingEntry, setEditingEntry] = useState<AccountEntry | null>(null);
  const [entries, setEntries] = useState<AccountEntry[]>(data.entries);
  const [balanceInCents, setBalanceInCents] = useState(data.balanceInCents);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  function openDialog() {
    setIsCreating(true);
    setError(undefined);
  }

  async function onClose() {
    setIsCreating(false);
    setEditingEntry(null);
  }

  async function reloadEntries() {
    const data = await FinanceService.shared.getAccountEntries();
    setEntries(data.entries);
    setBalanceInCents(data.balanceInCents);
  }

  async function openEditDialog(accountEntry: AccountEntry) {
    setIsCreating(true);
    setEditingEntry(accountEntry);
    setError(undefined);
    await new Promise((resolve) => setTimeout(resolve, 0));
    titleRef.current!.value = accountEntry.title;
    valueRef.current!.value = Math.abs(accountEntry.valueInCents / 100).toFixed(
      2
    );
    purchasedATRef.current!.value = new Date(accountEntry.purchasedAt * 1000)
      .toISOString()
      .split("T")[0];
    tagRef.current!.value = accountEntry.tagId.toString();
    signRef.current!.value = accountEntry.valueInCents < 0 ? "-1" : "1";
  }

  async function onSubmit() {
    const title = titleRef.current?.value;
    const value = parseFloat(
      (valueRef.current?.value ?? "0").replace(",", ".")
    );
    const purchasedAt = purchasedATRef.current?.value;
    const tagId = Number(tagRef.current?.value ?? "0");
    const sign = Number(signRef.current?.value);

    if (!title || !value || !purchasedAt) {
      setError("Title & Value are required");
      return;
    }
    setError(undefined);

    try {
      await FinanceService.shared.createOrUpdateEntry(
        editingEntry?.id ?? 0,
        title,
        value * sign,
        purchasedAt,
        tagId
      );
      await reloadEntries();
      onClose();
    } catch (error: Error | any) {
      setError(error.message);
    }
  }

  return (
    <div>
      {isCreating && (
        <Dialog
          title={`Finances > Create Entry`}
          onClose={onClose}
          onSubmit={onSubmit}
          error={error}
        >
          <input
            type="text"
            placeholder="Title"
            id="dialogTitle"
            className="tb-textarea"
            style={{
              boxShadow: "none",
              outline: "none",
            }}
            ref={titleRef}
          />
          <div className="flex">
            <select className="bg-slate-500 px-2 rounded-md ml-1" ref={signRef}>
              <option value={1}>+</option>
              <option value={-1} selected>
                -
              </option>
            </select>
            <input
              type="text"
              placeholder="Value"
              id="dialogTitle"
              className="tb-textarea"
              style={{
                boxShadow: "none",
                outline: "none",
              }}
              ref={valueRef}
            />
          </div>
          <input
            type="date"
            placeholder="Title"
            id="dialogTitle"
            className="tb-textarea"
            style={{
              boxShadow: "none",
              outline: "none",
            }}
            defaultValue={new Date().toISOString().split("T")[0]}
            ref={purchasedATRef}
          />
          <select className="bg-slate-500" ref={tagRef}>
            <option value={0}>None</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.icon} {tag.title}
              </option>
            ))}
          </select>
        </Dialog>
      )}
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="overflow-auto max-h-[calc(100vh-57px)]">
        <div className="flex items-center justify-between me-8">
          <TitleView title="Finances" openDialog={openDialog} />
          <div className="text-lg">{(balanceInCents / 100).toFixed(2)}€</div>
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

export const loader = async () => {
  return await FinanceService.shared.getAccountEntries();
};
