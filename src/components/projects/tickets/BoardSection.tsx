import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Board } from "../../../models/board-structure";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import { ROUTES } from "../../../routes";
import TicketService from "../../../services/TicketService";
import { ButtonIcon } from "../../ButtonIcon";
import TicketRowDnDWrapper from "./TicketRowDnDWrapper";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export const BoardSection: React.FC<{
  board: Board;
  project: Project;
  hideDone: boolean;
  isBoardVisible: boolean;
  searchTerm: string;
  toggleBoard: (boardId: number) => void;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
  onTouchStart?: (event: React.TouchEvent, ticket: Ticket) => void;
  reload: () => Promise<void>;
  hoverIndex: number;
  setHoverIndex: (index: number) => void;
}> = ({
  board,
  project,
  hideDone,
  isBoardVisible,
  searchTerm,
  toggleBoard,
  onContextMenu,
  onTouchStart,
  reload,
  hoverIndex,
  setHoverIndex,
}) => {
  const tickets = board.tickets.filter(
    (t) =>
      (!hideDone || t.status !== "done") &&
      (t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const totalTickets = board.tickets.length;
  const doneTickets = board.tickets.filter((e) => e.status === "done").length;

  const [dragIndex, setDragIndex] = useState(-1);

  async function moveTicket(dragIndex: number, hoverIndex: number) {
    if (dragIndex === hoverIndex) {
      return;
    }
    console.log("Moving ticket", dragIndex, hoverIndex);
    await TicketService.shared.moveTicket(
      project.slug,
      board.id,
      dragIndex,
      hoverIndex
    );
    await reload();
  }

  return (
    <div key={board.id} className={tickets.length === 0 ? "hidden" : ""}>
      <div className="flex flex-row justify-between px-4 sm:h-11 bg-mediumBlue border-b border-b-darkBlue">
        <div className="flex gap-2 h-11 items-center w-1/2 ">
          <div className="text-base overflow-x-hidden text-ellipsis max-w-[100%]">
            {board.id === 0 ? (
              <div className="cursor-default">Backlog</div>
            ) : (
              <NavLink
                to={ROUTES.BOARD_DETAILS(project.slug, board.id)}
                className="overflow-x-hidden whitespace-nowrap"
              >
                {board.title}
              </NavLink>
            )}
          </div>

          <ButtonIcon onClick={toggleBoard.bind(null, board.id)}>
            {isBoardVisible ? (
              <FaChevronDown className="w-5 h-5" />
            ) : (
              <FaChevronRight className="w-5 h-5" />
            )}
          </ButtonIcon>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-gray-400 w-12 text-right">
            {doneTickets}/{totalTickets}
          </div>
          <div className="h-1 w-20 sm:w-64 bg-neutral-200 dark:bg-neutral-600">
            <div
              className="h-1 bg-olive"
              style={{ width: `${(doneTickets / totalTickets) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      {isBoardVisible &&
        tickets.map((ticket: Ticket) => (
          <TicketRowDnDWrapper
            key={ticket.id}
            project={project}
            ticket={ticket}
            onContextMenu={onContextMenu}
            onTouchStart={onTouchStart}
            dragIndex={dragIndex}
            hoverIndex={hoverIndex}
            setDragIndex={setDragIndex}
            setHoverIndex={setHoverIndex}
            index={ticket.id}
            id={ticket.id}
            moveTicket={moveTicket}
          />
        ))}
    </div>
  );
};

export default BoardSection;
