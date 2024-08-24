import { Status } from "../../../models/status";
import TicketStatus from "../TicketStatus";
import DropdownElement from "./DropdownElement";
import TicketDetailsDropdown from "./TicketDetailsDropdown";

export const StatusDropdown: React.FC<{
  selectedStatus: Status;
  states: Status[];
  onClick: (status: Status | null) => void;
  style?: React.HTMLAttributes<HTMLDivElement>["style"];
}> = ({ selectedStatus, states, onClick, style }) => {
  return (
    <TicketDetailsDropdown
      onClose={onClick}
      toggleId="statusDropdown"
      style={style}
    >
      {states.map((state) => (
        <DropdownElement
          key={state}
          isSelected={selectedStatus === state}
          onClick={onClick.bind(this, state)}
        >
          <TicketStatus status={state} />
        </DropdownElement>
      ))}
    </TicketDetailsDropdown>
  );
};

export default StatusDropdown;
