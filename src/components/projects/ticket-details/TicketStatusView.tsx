import { TicketStatus } from "../../../models/ticket-status";
import { doneIcon, inProgressIcon, openIcon } from "../../../utils/ticketUtils";

export const TicketStatusView: React.FC<{
  status: TicketStatus;
}> = ({ status }) => {
  return (
    <div className="flex gap-1 items-center capitalize">
      {status === "open" && openIcon}
      {status === "inProgress" && inProgressIcon}
      {status === "done" && doneIcon}
      {status}
    </div>
  );
};

export default TicketStatusView;
