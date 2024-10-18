import { useDrop } from "react-dnd";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import { TicketStatus } from "../../../models/ticket-status";
import TicketService from "../../../services/TicketService";
import BoardTicketRow from "./BoardTicketRow";
import { useToast } from "../../../store/ToastContext";

export const BoardColumn: React.FC<{
  status: TicketStatus;
  title: string;
  project: Project;
  tickets: Ticket[];
  update: () => Promise<void>;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
  onTouchStart?: (event: React.TouchEvent, ticket: Ticket) => void;
}> = ({ status, title, project, tickets, update, onContextMenu, onTouchStart }) => {
  const {showToast} = useToast();

  const [{ isOver }, drop] = useDrop({
    accept: "TICKET",
    drop: async (item: { slug: string }) => {
      await TicketService.shared.update(project.slug, item.slug, {
        status,
      });
      showToast(`${item.slug} updated`, `Moved to ${title}`);
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
          onTouchStart={onTouchStart}
        />
      ))}
    </div>
  );
};
