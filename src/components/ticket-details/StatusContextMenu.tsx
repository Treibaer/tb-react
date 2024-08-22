import { useEffect, useRef } from "react";
import TicketStatus from "../../pages/projects/TicketStatus";

export const StatusContextMenu: React.FC<{ onClose: (status: string) => void }> = ({
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !event.composedPath().includes(document.getElementById("statusDropdown")!)
    ) {
      onClose("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  async function onStatusChange(status: string) {
    onClose(status);
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute select-none top-9 tb-container active tb-transparent-menu tb-context-menu show left-20 w-[140px]"
    >
      <div
        className="tb-dropdown-item"
        onClick={onStatusChange.bind(this, "open")}
      >
        <TicketStatus status="open" />
      </div>
      <div
        className="tb-dropdown-item"
        onClick={onStatusChange.bind(this, "inProgress")}
      >
        <TicketStatus status="inProgress" />
      </div>
      <div
        className="tb-dropdown-item"
        onClick={onStatusChange.bind(this, "done")}
      >
        <TicketStatus status="done" />
      </div>
    </div>
  );
};

export default StatusContextMenu;
