import { User } from "../../../../models/user";
import TicketAssigneeField from "../TicketAssigneeField";
import DropdownElement from "./DropdownElement";
import TicketDetailsDropdown from "./TicketDetailsDropdown";

export const AssigneeDropdown: React.FC<{
  selectedAssignee: User | null;
  users: User[];
  onClick: (userId: number | null) => void;
  style?: React.CSSProperties;
  showNumbers?: boolean;
}> = ({ users, onClick, selectedAssignee, style, showNumbers }) => {
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
        {showNumbers && (
          <div className="absolute right-2 text-gray-400">[1]</div>
        )}
      </DropdownElement>
      {users.map((user, index) => (
        <DropdownElement
          key={user.id}
          isSelected={user.id === selectedAssignee?.id}
          dataCy={`assignee-${user.id}`}
          onClick={onClick.bind(this, user.id)}
        >
          <TicketAssigneeField user={user} />
          {showNumbers && (
            <div className="absolute right-2 text-gray-400">[{index + 2}]</div>
          )}
        </DropdownElement>
      ))}
    </TicketDetailsDropdown>
  );
};

export default AssigneeDropdown;
