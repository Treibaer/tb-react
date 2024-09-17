import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import { Board } from "../../../models/board-structure";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import { ROUTES } from "../../../routes";
import { ButtonIcon } from "../../ButtonIcon";
import TicketRow from "./TicketRow";

export const BoardSection: React.FC<{
  board: Board;
  project: Project;
  hideDone: boolean;
  isBoardVisible: boolean;
  searchTerm: string;
  toggleBoard: (boardId: number) => void;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
  onTouchStart?: (event: React.TouchEvent, ticket: Ticket) => void;
}> = ({
  board,
  project,
  hideDone,
  isBoardVisible,
  searchTerm,
  toggleBoard,
  onContextMenu,
  onTouchStart,
}) => {
  const tickets = board.tickets.filter(
    (t) =>
      (!hideDone || t.status !== "done") &&
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalTickets = board.tickets.length;
  const doneTickets = board.tickets.filter((e) => e.status === "done").length;
  return (
    <div key={board.id}>
      <div className="flex flex-col sm:flex-row justify-between px-4 sm:h-11 bg-mediumBlue border-b border-b-darkBlue">
        <div className="flex gap-3 h-11 items-center">
          <NavLink
            to={ROUTES.BOARD_DETAILS(project.slug, board.id)}
            className="text-base overflow-x-hidden whitespace-nowrap"
          >
            <div>{board.title}</div>
          </NavLink>

          <ButtonIcon onClick={toggleBoard.bind(null, board.id)}>
            {isBoardVisible ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </ButtonIcon>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-gray-400 w-12 text-right">
            {doneTickets}/{totalTickets}
          </div>
          <div className="h-1 w-64 sm:w-64 bg-neutral-200 dark:bg-neutral-600">
            <div
              className="h-1 bg-olive"
              style={{ width: `${(doneTickets / totalTickets) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      {isBoardVisible &&
        tickets.map((ticket: Ticket) => (
          <TicketRow
            key={ticket.id}
            project={project}
            ticket={ticket}
            onContextMenu={onContextMenu}
            onTouchStart={onTouchStart}
          />
        ))}
    </div>
  );
};

export default BoardSection;
