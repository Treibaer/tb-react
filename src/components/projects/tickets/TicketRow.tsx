import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import { ROUTES } from "../../../routes";
import UserView from "../../UserView";

interface TicketRowProps {
  project: Project;
  ticket: Ticket;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
}

export default function TicketRow({
  project,
  ticket,
  onContextMenu,
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
    >
      <div className="flex gap-4 border-b border-b-[rgb(37,38,50)] p-2 justify-start items-center bg:[rgb(25,26,35)] hover:bg-[rgb(28,29,42)]">
        <div className="flex-grow flex gap-4 items-center">
          <div>
            {ticket.status === "open" && (
              <InformationCircleIcon className="h-6 w-6 text-gray-400" />
            )}
            {ticket.status === "inProgress" && (
              <EllipsisHorizontalCircleIcon className="h-6 w-6 text-yellow-600" />
            )}
            {ticket.status === "done" && (
              <CheckCircleIcon className="h-6 w-6 text-green-800" />
            )}
          </div>
          <div className="text-gray-400 w-16">{ticket.slug}</div>
          <div>{ticket.title}</div>
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
