import { TicketStatus } from "../../../models/ticket-status";
import { doneIcon, inProgressIcon, openIcon } from "../../../utils/ticketUtils";

export const TicketStatusView: React.FC<{
  status: TicketStatus;
  onlyIcon?: boolean;
}> = ({ status, onlyIcon: ignoreText }) => {
  return (
    <div className="flex gap-2 items-center capitalize">
      {status === "open" && openIcon}
      {status === "inProgress" && inProgressIcon}
      {status === "done" && doneIcon}
      {!ignoreText && status}
    </div>
  );
};

export default TicketStatusView;
