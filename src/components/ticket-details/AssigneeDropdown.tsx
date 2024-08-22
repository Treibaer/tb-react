import { User } from "../../models/user";
import TicketAssigneeField from "./TicketAssigneeField";
import TicketDetailsDropdown from "./components/TicketDetailsDropdown";

export const AssigneeDropdown: React.FC<{
  users: User[];
  onClose: (userId: number | null) => void;
}> = ({ users, onClose }) => {
  async function onChange(userId: number) {
    onClose(userId);
  }

  return (
    <TicketDetailsDropdown onClose={onClose} toggleId="assigneeDropdown">
      <div className="tb-dropdown-item" onClick={onChange.bind(this, 0)}>
        <TicketAssigneeField user={null} />
      </div>
      {users.map((user) => (
        <div
          key={user.id}
          className="tb-dropdown-item"
          onClick={onChange.bind(this, user.id)}
        >
          <TicketAssigneeField user={user} />
        </div>
      ))}
    </TicketDetailsDropdown>
  );
};

export default AssigneeDropdown;
