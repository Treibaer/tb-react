import { useDrop } from "react-dnd";
import useParty from "../../../hooks/useParty";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import { TicketStatus } from "../../../models/ticket-status";
import TicketService from "../../../services/TicketService";
import { showToast } from "../../../utils/tbToast";
import { doneIcon, inProgressIcon, openIcon } from "../../../utils/ticketUtils";
import BoardTicketRow from "./BoardTicketRow";

export const BoardColumn: React.FC<{
  status: TicketStatus;
  project: Project;
  tickets: Ticket[];
  update: () => Promise<void>;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
  onTouchStart?: (event: React.TouchEvent, ticket: Ticket) => void;
}> = ({ status, project, tickets, update, onContextMenu, onTouchStart }) => {
  const { startParty } = useParty();

  let title: string;
  let icon: JSX.Element;
  let color: string;

  switch (status) {
    case "open":
      title = "Open";
      icon = openIcon;
      break;
    case "inProgress":
      title = "In Progress";
      icon = inProgressIcon;
      break;
    case "done":
      title = "Done";
      icon = doneIcon;
      break;
  }

  const [{ isOver }, drop] = useDrop({
    accept: "TICKET",
    drop: async (item: { slug: string }) => {
      const oldStatus = tickets.find((t) => t.slug === item.slug)?.status;
      if (status === oldStatus) {
        return;
      }
      const ticket = await TicketService.shared.update(project.slug, item.slug, {
        status,
      });
      if (status === "done" && ticket.parent === null) {
        startParty();
      }
      showToast("state", item.slug, status);
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
      <div className="flex items-center gap-2">
        <div className="text-lg">{title}</div>
        <div>{icon}</div>
      </div>
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
