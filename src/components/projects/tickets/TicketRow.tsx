import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import { ROUTES } from "../../../routes";
import { doneIcon, inProgressIcon, openIcon } from "../../../utils/ticketUtils";
import UserView from "../../UserView";
import ProgressCircle from "../../common/ProgressCircle";
import Button from "../../Button";

interface TicketRowProps {
  project: Project;
  ticket: Ticket;
  opacity?: number;
}

export default function TicketRow({
  project,
  ticket,
  opacity,
}: TicketRowProps) {
  const finishedSubtasks = ticket.children.filter(
    (c) => c.status === "done"
  ).length;
  return (
    <NavLink
      to={ROUTES.TICKET_DETAILS(project.slug, ticket.slug)}
      key={ticket.id}
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
        {ticket.parentId && (
          <div className="rounded border-gray-500 border px-2">Subtask</div>
        )}
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
