import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import TicketRow from "./TicketRow";
export declare type Identifier = string | symbol;

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const TicketRowDnDWrapper: React.FC<{
  dragIndex: number;
  setDragIndex: (index: number) => void;
  hoverIndex: number;
  setHoverIndex: (index: number) => void;
  index: number;
  id: number;
  project: Project;
  ticket: Ticket;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
  onTouchStart?: (event: React.TouchEvent, ticket: Ticket) => void;
  moveTicket: (dragIndex: number, hoverIndex: number) => void;
}> = ({
  dragIndex,
  setDragIndex,
  hoverIndex,
  setHoverIndex,
  index,
  id,
  project,
  ticket,
  onContextMenu,
  onTouchStart,
  moveTicket,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [_, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      setHoverIndex(hoverIndex);
      setDragIndex(dragIndex);
    },
    drop(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      setHoverIndex(-1);
      setDragIndex(-1);
      moveTicket(dragIndex, hoverIndex);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      setDragIndex(index);
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      onContextMenu={(e) => onContextMenu(e, ticket)}
      onTouchStart={(e) => onTouchStart && onTouchStart(e, ticket)}
    >
      <TicketRow
        project={project}
        ticket={ticket}
        opacity={index === dragIndex ? 0.5 : index === hoverIndex ? 0.2 : 1}
      />
    </div>
  );
};

export default TicketRowDnDWrapper;
