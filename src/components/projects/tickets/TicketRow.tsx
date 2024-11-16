import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import { ROUTES } from "../../../routes";
import { doneIcon, inProgressIcon, openIcon } from "../../../utils/ticketUtils";
import UserView from "../../UserView";
import ProgressCircle from "../../common/ProgressCircle";

interface TicketRowProps {
  project: Project;
  ticket: Ticket;
  opacity?: number;
  onContextMenu?: (event: React.MouseEvent, ticket: Ticket) => void;
  onTouchStart?: (event: React.TouchEvent, ticket: Ticket) => void;
}

export default function TicketRow({
  project,
  ticket,
  opacity,
  onContextMenu,
  onTouchStart,
}: TicketRowProps) {
  const finishedSubtasks = ticket.children.filter(
    (c) => c.status === "done"
  ).length;
  return (
    <NavLink
      to={ROUTES.TICKET_DETAILS(project.slug, ticket.slug)}
      key={ticket.id}
      onContextMenu={(e) => onContextMenu && onContextMenu(e, ticket)}
      onTouchStart={(e) => onTouchStart && onTouchStart(e, ticket)}
      data-cy={`ticket-${ticket.slug}`}
    >
      <div className="tb-row" style={{ opacity }}>
        <div className="flex-grow flex gap-2 sm:gap-4 items-center">
          <div>
            {ticket.status === "open" && openIcon}
            {ticket.status === "inProgress" && inProgressIcon}
            {ticket.status === "done" && doneIcon}
          </div>
          <div className="text-gray-400 w-16 flex-none">{ticket.slug}</div>
          <div className="flex gap-2 items-center text-base">
            <div>{ticket.title}</div>
            {ticket.description && <FaBars className="h-4 w-4 text-gray-400" />}
          </div>
        </div>
        {ticket.children.length > 0 && (
          <ProgressCircle
            done={finishedSubtasks}
            total={ticket.children.length}
          />
        )}
        {ticket.type && (
          <div className="rounded border-gray-500 border px-2">
            {ticket.type}
          </div>
        )}
        {ticket.parent && (
          <div className="rounded border-gray-500 border px-2">Subtask</div>
        )}
        <UserView user={ticket.assignee} />
      </div>
    </NavLink>
  );
}
