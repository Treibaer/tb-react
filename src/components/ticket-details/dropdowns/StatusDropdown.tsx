import { TicketStatus } from "../../../models/ticket-status";
import TicketStatusView from "../TicketStatusView";
import DropdownElement from "./DropdownElement";
import TicketDetailsDropdown from "./TicketDetailsDropdown";

export const StatusDropdown: React.FC<{
  selectedStatus: TicketStatus;
  states: TicketStatus[];
  onClick: (status: TicketStatus | null) => void;
  style?: React.CSSProperties;
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
          <TicketStatusView status={state} />
        </DropdownElement>
      ))}
    </TicketDetailsDropdown>
  );
};

export default StatusDropdown;
