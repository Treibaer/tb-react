import { TicketStatus } from "../../../../models/ticket-status";
import TicketStatusView from "../TicketStatusView";
import DropdownElement from "./DropdownElement";
import TicketDetailsDropdown from "./TicketDetailsDropdown";

export const StatusDropdown: React.FC<{
  selectedStatus: TicketStatus;
  states: TicketStatus[];
  onClick: (status: TicketStatus | null) => void;
  style?: React.CSSProperties;
  showNumbers?: boolean;
}> = ({ selectedStatus, states, onClick, style, showNumbers }) => {
  return (
    <TicketDetailsDropdown
      onClose={onClick}
      toggleId="statusDropdown"
      style={style}
    >
      {states.map((state, index) => (
        <DropdownElement
          key={state}
          isSelected={selectedStatus === state}
          onClick={onClick.bind(this, state)}
        >
          <TicketStatusView status={state} />
          {showNumbers && <div className="absolute right-2 text-gray-400">[{index + 1}]</div>}
        </DropdownElement>
      ))}
    </TicketDetailsDropdown>
  );
};

export default StatusDropdown;
