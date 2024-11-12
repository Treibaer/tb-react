import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import TicketRow from "./TicketRow";
import DnDWrapper from "./DndWrapper";
export declare type Identifier = string | symbol;

interface DragItem {
  id: number;
}

const TicketRowDnDWrapper: React.FC<{
  project: Project;
  ticket: Ticket;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
  onTouchStart?: (event: React.TouchEvent, ticket: Ticket) => void;
  moveTicket: (dragIndex: number, hoverIndex: number) => void;
}> = ({
  project,
  ticket,
  onContextMenu,
  onTouchStart,
  moveTicket,
}) => {
  

  return (
    <div></div>
    // <div
    //   ref={ref}
    //   style={{ opacity }}
    //   onContextMenu={(e) => onContextMenu(e, ticket)}
    //   onTouchStart={(e) => onTouchStart && onTouchStart(e, ticket)}
    // >
    //   <TicketRow
    //     project={project}
    //     ticket={ticket}
    //     opacity={index === dragIndex ? 0.5 : index === hoverIndex ? 0.2 : 1}
    //   />
    // </div>
  );
};

export default TicketRowDnDWrapper;
