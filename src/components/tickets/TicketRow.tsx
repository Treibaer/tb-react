import { NavLink } from "react-router-dom";
import { Project } from "../../models/project";
import { Ticket } from "../../models/ticket";
import Constants from "../../services/Constants";

interface TicketRowProps {
  project: Project;
  ticket: Ticket;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
}

export const TicketRow: React.FC<TicketRowProps> = ({
  project,
  ticket,
  onContextMenu,
}) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e, ticket);
  };

  return (
    <NavLink
      to={`/projects/${project.slug}/tickets/${ticket.slug}`}
      key={ticket.id}
      onContextMenu={handleContextMenu}
    >
      <div>{ticket.slug}</div>
      <div>{ticket.title}</div>
      <div className="tb-list">
        <img
          className="avatar small"
          src={`${Constants.backendUrl}${ticket.assignee?.avatar}`}
          alt={`${ticket.assignee?.firstName || 'Assignee'}'s avatar`}
        />
      </div>
    </NavLink>
  );
};
