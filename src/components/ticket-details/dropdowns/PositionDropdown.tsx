import { StyleProps } from "../../../models/style-props";
import { Ticket } from "../../../models/ticket";
import DropdownElement from "./DropdownElement";
import TicketDetailsDropdown from "./TicketDetailsDropdown";

export const PositionDropdown: React.FC<{
  position: number;
  tickets: Ticket[];
  onClick: (userId: number | null) => void;
  style?: StyleProps;
}> = ({ position, tickets, onClick, style }) => {
  return (
    <TicketDetailsDropdown
      onClose={onClick}
      toggleId="positionDropdown"
      style={style}
    >
      <DropdownElement isSelected={false} onClick={onClick.bind(this, 0)}>
        <div>Top</div>
      </DropdownElement>
      <DropdownElement isSelected={false} onClick={onClick.bind(this, 10000)}>
        <div>Bottom</div>
      </DropdownElement>
      {tickets.map((ticket) => (
        <DropdownElement
          key={ticket.id}
          isSelected={false}
          onClick={onClick.bind(
            this,
            position > ticket.position ? ticket.position + 1 : ticket.position
          )}
        >
          <div>
            Below {ticket.slug} : {ticket.title}
          </div>
        </DropdownElement>
      ))}
    </TicketDetailsDropdown>
  );
};

export default PositionDropdown;
