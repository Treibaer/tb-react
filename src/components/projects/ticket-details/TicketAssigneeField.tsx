import { FaUserCircle } from "react-icons/fa";
import { User } from "../../../models/user";

export const TicketAssigneeField: React.FC<{ user: User | null }> = ({
  user,
}) => {
  return (
    <>
      {!user && (
        <div className="flex items-center gap-2">
          <FaUserCircle className="size-5" />
          <div>No assignee</div>
        </div>
      )}
      {user && (
        <div className="flex items-center gap-2">
          <img
            src={user?.avatar}
            alt="avatar"
            className="size-5 rounded-full"
          />
          <div>{user?.firstName}</div>
        </div>
      )}
    </>
  );
};

export default TicketAssigneeField;
