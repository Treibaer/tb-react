import { useDrop } from "react-dnd";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import { TicketStatus } from "../../../models/ticket-status";
import TicketService from "../../../services/TicketService";
import BoardTicketRow from "./BoardTicketRow";

export const BoardColumn: React.FC<{
  status: TicketStatus;
  title: string;
  project: Project;
  tickets: Ticket[];
  update: () => void;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
}> = ({ status, title, project, tickets, update, onContextMenu }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TICKET",
    drop: async (item: { slug: string }) => {
      await TicketService.shared.update(project.slug, item.slug, {
        status,
      });
      await update();
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`column ${isOver ? "highlight" : ""} flex flex-col gap-2`}
      style={{ flex: 1 }}
    >
      <h3>{title}</h3>
      {tickets.map((ticket) => (
        <BoardTicketRow
          key={ticket.id}
          ticket={ticket}
          projectSlug={project.slug}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  );
};
