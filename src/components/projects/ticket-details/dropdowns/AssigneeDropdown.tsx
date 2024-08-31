import { User } from "../../../../models/user";
import TicketAssigneeField from "../TicketAssigneeField";
import DropdownElement from "./DropdownElement";
import TicketDetailsDropdown from "./TicketDetailsDropdown";

export const AssigneeDropdown: React.FC<{
  selectedAssignee: User | null;
  users: User[];
  onClick: (userId: number | null) => void;
  style?: React.CSSProperties;
}> = ({ users, onClick, selectedAssignee, style }) => {
  return (
    <TicketDetailsDropdown
      onClose={onClick}
      toggleId="assigneeDropdown"
      style={style}
    >
      <DropdownElement
        isSelected={selectedAssignee === null}
        onClick={onClick.bind(this, 0)}
      >
        <TicketAssigneeField user={null} />
      </DropdownElement>
      {users.map((user) => (
        <DropdownElement
          key={user.id}
          isSelected={user.id === selectedAssignee?.id}
          onClick={onClick.bind(this, user.id)}
        >
          <TicketAssigneeField user={user} />
        </DropdownElement>
      ))}
    </TicketDetailsDropdown>
  );
};

export default AssigneeDropdown;
