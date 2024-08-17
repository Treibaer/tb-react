import { NavLink } from "react-router-dom";
import { Project } from "../../models/project";
import { Ticket } from "../../models/ticket";
import Constants from "../../services/Constants";

export const TicketRow: React.FC<{ project: Project; ticket: Ticket, onContextMenu: any }> = ({
  project,
  ticket,
  onContextMenu,
}) => {
  function handleContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();
    onContextMenu(e, ticket); 
  }

  console.log("ticket", ticket);
  

  return (
    <NavLink
      to={`/projects/${project.slug}/tickets/${ticket.slug}`}
      key={ticket.id}
      onContextMenu={(e) => handleContextMenu(e, ticket)}
    >
      <div>{ticket.slug}</div>
      <div>{ticket.title}</div>
      <div className="tb-list">
        <img className="avatar small" src={`${Constants.backendUrl}${ticket.assignee?.avatar}`} alt="arrow-right" />
      </div>
    </NavLink>
  );
};
