import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaCopy, FaTrash } from "react-icons/fa";
import { AccountEntry } from "../../models/finances/account-entry";
import { TicketsContextMenuConfig } from "../../models/tickets-context-menu-config";
import { FinanceService } from "../../services/financeService";
import { showToast } from "../../utils/tbToast";
import Confirmation from "../common/Confirmation";
import DropdownElement from "../projects/ticket-details/dropdowns/DropdownElement";

export const FinanceEntryContextMenu: React.FC<{
  config: TicketsContextMenuConfig;
  onClose: (update: boolean) => void;
  onCreateSimilar: (entry: AccountEntry) => void;
}> = ({ config, onClose, onCreateSimilar }) => {
  const entry = config.value!;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      onClose(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const [removingId, setRemovingId] = useState<number | null>(null);

  async function removeTicket() {
    if (removingId) {
      await FinanceService.shared.removeEntry(removingId);
      onClose(true);
      showToast("success", "", "Entry deleted");
    }
  }

  function createSimilar(entry: AccountEntry) {
    onClose(false);
    onCreateSimilar(entry);
  }

  return (
    <div ref={dropdownRef}>
      <AnimatePresence>
        {removingId && (
          <Confirmation
            onCancel={() => setRemovingId(null)}
            onConfirm={removeTicket}
          />
        )}
      </AnimatePresence>
      <div
        className={`ticket-details-dropdown tb-transparent-menu py-1 w-36`}
        style={{ left: config.left, top: config.top }}
      >
        <DropdownElement
          isSelected={false}
          onClick={() => createSimilar(entry as AccountEntry)}
        >
          <div className="flex gap-2">
            <FaCopy className="size-4 text-gray-400 mt-1" />
            <div>Create similar</div>
          </div>
        </DropdownElement>
        <DropdownElement
          isSelected={false}
          onClick={() => setRemovingId(entry.id)}
        >
          <div className="flex gap-2">
            <FaTrash className="size-4 text-gray-400 mt-1" />
            <div>Delete</div>
          </div>
        </DropdownElement>
      </div>
    </div>
  );
};

export default FinanceEntryContextMenu;
