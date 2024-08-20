import { useState } from "react";
import { Notification } from "./notification";

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState([1, 2, 3, 4, 5]);

  return (
    <div className="fixed flex flex-col gap-2 right-4 top-4 w-[384px]">
      {notifications.map((_, index) => (
        <Notification />
      ))}
    </div>
  );
};
