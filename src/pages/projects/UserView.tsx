import { UserCircleIcon } from "@heroicons/react/24/solid";
import { User } from "../../models/user";

export const UserView: React.FC<{ user: User | null }> = ({ user }) => {
  return (
    <div>
      {user ? (
        <img
          className="h-7 w-7 rounded-full"
          src={`${user.avatar}`}
          alt={`${user.firstName || "Assignee"}'s avatar`}
        />
      ) : (
        <UserCircleIcon className="h-7 w-7 text-gray-400" />
      )}
    </div>
  );
};

export default UserView;
