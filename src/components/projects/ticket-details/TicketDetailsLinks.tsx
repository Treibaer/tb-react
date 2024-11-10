import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useContextMenu from "../../../hooks/useContextMenu";
import { ProjectMeta } from "../../../models/project-meta";
import { Ticket } from "../../../models/ticket";
import TicketService from "../../../services/ticketService";
import ContextMenu from "../../contextmenu/ContextMenu";
import DnDWrapper from "../tickets/DndWrapper";
import TicketRow from "../tickets/TicketRow";

const TicketDetailsLinks: React.FC<{
  metadata: ProjectMeta;
  ticket: Ticket;
  refresh: () => void;
}> = ({ metadata, ticket, refresh }) => {
  if (ticket.children.length === 0) {
    return null;
  }

  const [dragIndex, setDragIndex] = useState(-1);
  const [hoverIndex, setHoverIndex] = useState(-1);

  async function moveTicket(dragIndex: number, hoverIndex: number) {
    if (dragIndex === hoverIndex) {
      return;
    }
    await TicketService.shared.moveSubtask(
      metadata.project.slug,
      ticket.slug,
      dragIndex,
      hoverIndex
    );
    refresh();
  }

  const { config, openContextMenu, openContextMenuTouch, closeContextMenu } =
    useContextMenu({ refresh });

  return (
    <>
      <AnimatePresence>
        {config.show && (
          <ContextMenu
            metadata={metadata}
            config={config}
            onClose={closeContextMenu}
            showBoard={false}
          />
        )}
      </AnimatePresence>
      {ticket.children.length > 0 && (
        <DndProvider backend={HTML5Backend}>
          <div className="text-gray-400 mb-2 text-lg">Subtasks</div>
          {ticket.children.map((child) => (
            <DnDWrapper
              key={child.id}
              dragIndex={dragIndex}
              hoverIndex={hoverIndex}
              setDragIndex={setDragIndex}
              setHoverIndex={setHoverIndex}
              id={child.id}
              moveTicket={moveTicket}
            >
              <TicketRow
                project={metadata.project}
                ticket={child}
                onContextMenu={openContextMenu}
                onTouchStart={openContextMenuTouch}
              />
            </DnDWrapper>
          ))}
        </DndProvider>
      )}
    </>
  );
};

export default TicketDetailsLinks;
