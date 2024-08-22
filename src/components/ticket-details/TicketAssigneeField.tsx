import { UserCircleIcon } from "@heroicons/react/24/solid";
import { User } from "../../models/user";

export const TicketAssigneeField: React.FC<{ user: User | null }> = ({
  user,
}) => {
  return (
    <>
      {!user && (
        <div className="flex items-center gap-2">
          <UserCircleIcon className="w-5 h-5" />
          <div>No assignee</div>
        </div>
      )}
      {user && (
        <div className="flex items-center gap-2">
          <img
            src={user?.avatar}
            alt="avatar"
            className="w-5 h-5 rounded-full"
          />
          <div>{user?.firstName}</div>
        </div>
      )}
    </>
  );
};

export default TicketAssigneeField;
