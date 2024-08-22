import TicketStatus from "../../pages/projects/TicketStatus";
import TicketDetailsDropdown from "./components/TicketDetailsDropdown";

export const StatusDropdown: React.FC<{
  onClose: (status: string | null) => void;
}> = ({ onClose }) => {
  async function onStatusChange(status: string | null) {
    onClose(status);
  }

  return (
    <TicketDetailsDropdown onClose={onClose} toggleId="statusDropdown">
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
    </TicketDetailsDropdown>
  );
};

export default StatusDropdown;
