import { useEffect, useRef } from "react";
import { User } from "../../models/user";
import TicketAssigneeField from "./TicketAssigneeField";

export const AssigneeContextMenu: React.FC<{
  users: User[];
  onClose: (userId: number | null) => void;
}> = ({ users, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !event
        .composedPath()
        .includes(document.getElementById("assigneeDropdown")!)
    ) {
      onClose(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  async function onStatusChange(userId: number) {
    onClose(userId);
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute select-none top-9 tb-container active tb-transparent-menu tb-context-menu show left-20 w-[142px]"
    >
      <div className="tb-dropdown-item" onClick={onStatusChange.bind(this, 0)}>
        <TicketAssigneeField user={null} />
      </div>
      {users.map((user) => (
        <div
          key={user.id}
          className="tb-dropdown-item"
          onClick={onStatusChange.bind(this, user.id)}
        >
          <TicketAssigneeField user={user} />
        </div>
      ))}
    </div>
  );
};

export default AssigneeContextMenu;
