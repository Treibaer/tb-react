import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import { ROUTES } from "../../../routes";
import { doneIcon, inProgressIcon, openIcon } from "../../../utils/ticketUtils";
import UserView from "../../UserView";

interface TicketRowProps {
  project: Project;
  ticket: Ticket;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
  onTouchStart?: (event: React.TouchEvent, ticket: Ticket) => void;
  backgroundColor?: string;
  opacity?: number;
}

export default function TicketRow({
  project,
  ticket,
  onContextMenu,
  onTouchStart,
  backgroundColor,
  opacity,
}: TicketRowProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e, ticket);
  };

  return (
    <NavLink
      to={ROUTES.TICKET_DETAILS(project.slug, ticket.slug)}
      key={ticket.id}
      onContextMenu={handleContextMenu}
      onTouchStart={(e) => onTouchStart && onTouchStart(e, ticket)}
    >
      <div className="tb-row" style={{ backgroundColor, opacity }}>
        <div className="flex-grow flex gap-1 sm:gap-4 items-center">
          <div>
            {ticket.status === "open" && openIcon}
            {ticket.status === "inProgress" && inProgressIcon}
            {ticket.status === "done" && doneIcon}
          </div>
          <div className="text-gray-400 w-16 flex-none">{ticket.slug}</div>
          <div className="flex gap-2 items-center text-sm sm:text-base">
            <div>{ticket.title}</div>
            {ticket.description && <FaBars className="h-4 w-4 text-gray-400" />}
          </div>
        </div>
        {ticket.type && (
          <div className="rounded border-gray-500 border px-2">
            {ticket.type}
          </div>
        )}
        <UserView user={ticket.assignee} />
      </div>
    </NavLink>
  );
}
