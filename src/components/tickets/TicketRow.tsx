import { NavLink } from "react-router-dom";
import { Project } from "../../models/project";
import { Ticket } from "../../models/ticket";

export const TicketRow: React.FC<{ project: Project; ticket: Ticket, onContextMenu: any }> = ({
  project,
  ticket,
  onContextMenu,
}) => {
  function handleContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();
    // console.log("right click");
    // console.log("ticket", ticket);
    onContextMenu(e, ticket);
    
  }

  return (
    <NavLink
      to={`/projects/${project.slug}/tickets/${ticket.slug}`}
      key={ticket.id}
      onContextMenu={(e) => handleContextMenu(e, ticket)}
    >
      <div>{ticket.slug}</div>
      <div>{ticket.title}</div>
    </NavLink>
  );
};
