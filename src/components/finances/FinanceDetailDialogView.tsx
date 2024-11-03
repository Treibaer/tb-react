import { useEffect, useRef } from "react";
import { AccountEntry } from "../../models/finances/account-entry";
import { AcccountTag } from "../../models/finances/account-tag";
import { FinanceService } from "../../services/FinanceService";
import Dialog from "../common/Dialog";
import { showToast } from "../../utils/tbToast";

const FinanceDetailDialogView: React.FC<{
  onClose: (reload: boolean) => void;
  editingEntry: AccountEntry | null;
  tags: AcccountTag[];
}> = ({ onClose, tags, editingEntry }) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const signRef = useRef<HTMLSelectElement>(null);
  const purchasedATRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editingEntry) {
      titleRef.current!.value = editingEntry.title;
      valueRef.current!.value = Math.abs(
        editingEntry.valueInCents / 100
      ).toFixed(2);
      purchasedATRef.current!.value = new Date(editingEntry.purchasedAt * 1000)
        .toISOString()
        .split("T")[0];
      tagRef.current!.value = editingEntry.tagId.toString();
      signRef.current!.value = editingEntry.valueInCents < 0 ? "-1" : "1";
    } else {
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    }
  }, [editingEntry]);

  async function onSubmit() {
    const title = titleRef.current?.value;
    const value = parseFloat(
      (valueRef.current?.value ?? "0").replace(",", ".")
    );
    const purchasedAt = purchasedATRef.current?.value;
    const tagId = Number(tagRef.current?.value ?? "0");
    const sign = Number(signRef.current?.value);

    if (!title || !value || !purchasedAt) {
      showToast("error", "", "Title & Value are required");
      return;
    }

    try {
      await FinanceService.shared.createOrUpdateEntry(
        editingEntry?.id ?? 0,
        title,
        value * sign,
        purchasedAt,
        tagId
      );
      onClose(true);
      showToast(
        "success",
        "",
        "Entry " + (editingEntry ? "Updated" : "Created")
      );
    } catch (error: Error | any) {
      showToast("error", "", error.message);
    }
  }

  return (
    <>
      <Dialog
        title={`Finances > ${editingEntry ? "Update" : "Create"} Entry`}
        onClose={() => onClose(false)}
        onSubmit={onSubmit}
        submitTitle={editingEntry ? "Update" : "Create"}
      >
        <input
          type="text"
          placeholder="Title"
          className="tb-input"
          ref={titleRef}
        />
        <div className="flex items-center gap-2">
          <select
            className="bg-section border border-border px-2 rounded-md ml-1 h-10"
            ref={signRef}
            defaultValue={-1}
          >
            <option value={1}>+</option>
            <option value={-1}>-</option>
          </select>
          <input
            type="number"
            placeholder="Value"
            className="tb-input"
            ref={valueRef}
          />
        </div>
        <input
          type="date"
          placeholder="Title"
          id="dialogTitle"
          className="tb-input"
          defaultValue={new Date().toISOString().split("T")[0]}
          ref={purchasedATRef}
        />
        <select
          className="bg-section border border-border rounded-md p-1 mt-1 ml-1 w-48"
          ref={tagRef}
        >
          <option value={0}>None</option>
          {tags
            .filter((tag) => tag.icon !== "")
            .map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.icon} {tag.title}
              </option>
            ))}
        </select>
      </Dialog>
    </>
  );
};

export default FinanceDetailDialogView;
