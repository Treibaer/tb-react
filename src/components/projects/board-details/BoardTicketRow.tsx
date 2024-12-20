import { useDrag } from "react-dnd";
import { NavLink } from "react-router-dom";
import { Ticket } from "../../../models/ticket";
import { ROUTES } from "../../../routes";
import ProgressCircle from "../../common/ProgressCircle";
import TicketAssigneeField from "../../projects/ticket-details/TicketAssigneeField";

export const BoardTicketRow: React.FC<{
  projectSlug: string;
  ticket: Ticket;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
  onTouchStart?: (event: React.TouchEvent, ticket: Ticket) => void;
}> = ({ projectSlug, ticket, onContextMenu, onTouchStart }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TICKET",
    item: { id: ticket.id, slug: ticket.slug, column: ticket.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e, ticket);
  };

  const finishedSubtasks = ticket.children.filter(
    (c) => c.status === "done"
  ).length;
  return (
    <NavLink
      to={ROUTES.TICKET_DETAILS(projectSlug, ticket.slug)}
      onContextMenu={handleContextMenu}
      onTouchStart={(e) => onTouchStart && onTouchStart(e, ticket)}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div
        className="flex flex-col gap-1 p-3 rounded-lg bg-row hover:bg-hover border border-border"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 24px",
        }}
      >
        <div>{`${ticket.slug}: ${ticket.title}`}</div>
        <div className="flex justify-between">
          <TicketAssigneeField user={ticket.assignee} />
          {ticket.children.length > 0 && (
            <ProgressCircle
              done={finishedSubtasks}
              total={ticket.children.length}
            />
          )}
        </div>
      </div>
    </NavLink>
  );
};
export default BoardTicketRow;
