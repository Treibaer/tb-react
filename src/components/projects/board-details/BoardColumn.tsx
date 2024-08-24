import { useDrop } from "react-dnd";
import BoardTicketRow from "./BoardTicketRow";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import ProjectService from "../../../services/ProjectService";

export const BoardColumn: React.FC<{
  state: string;
  title: string;
  project: Project;
  tickets: Ticket[];
  update: () => void;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
}> = ({ state, title, project, tickets, update, onContextMenu }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TICKET",
    drop: async (item: { slug: string }) => {
      await ProjectService.shared.updateTicketStatus(
        project.slug,
        item.slug,
        state
      );
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
