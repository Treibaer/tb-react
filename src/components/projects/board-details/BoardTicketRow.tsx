import { NavLink } from "react-router-dom";
import { Ticket } from "../../../models/ticket";
import { ROUTES } from "../../../routes";
import TicketAssigneeField from "../../ticket-details/TicketAssigneeField";
import { useDrag } from "react-dnd";

export const BoardTicketRow: React.FC<{
  projectSlug: string;
  ticket: Ticket;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
}> = ({ projectSlug, ticket, onContextMenu }) => {


  const [{ isDragging }, drag] = useDrag({
    type: 'TICKET',
    item: { id: ticket.id, slug: ticket.slug, column: ticket.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e, ticket);
  };


  return (
    <NavLink
      to={ROUTES.TICKET_DETAILS(projectSlug, ticket.slug)}
      onContextMenu={handleContextMenu}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div
        className="flex flex-col gap-1 p-3 rounded-lg"
        style={{
          border: "1px solid rgba(82, 82, 111, 0.44)",
          backgroundColor: "rgb(32, 33, 46)",
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 24px",
        }}
      >
        <div>{`${ticket.slug}: ${ticket.title}`}</div>
        <TicketAssigneeField user={ticket.assignee} />
      </div>
    </NavLink>
  );
};
export default BoardTicketRow;
