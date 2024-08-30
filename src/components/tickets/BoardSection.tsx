import { NavLink } from "react-router-dom";
import { Board } from "../../models/board-structure";
import { Project } from "../../models/project";
import { Ticket } from "../../models/ticket";
import { ROUTES } from "../../routes";
import Button from "../Button";
import TicketRow from "./TicketRow";

export const BoardSection: React.FC<{
  board: Board;
  project: Project;
  hideDone: boolean;
  isBoardVisible: boolean;
  searchTerm: string;
  toggleBoard: (boardId: number) => void;
  onContextMenu: (event: React.MouseEvent, ticket: Ticket) => void;
}> = ({
  board,
  project,
  hideDone,
  isBoardVisible,
  searchTerm,
  toggleBoard,
  onContextMenu,
}) => {
  const tickets = board.tickets.filter(
    (t) =>
      (!hideDone || t.status !== "done") &&
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div key={board.id} className="">
      <div className="flex gap-3 px-4 h-11 bg-[rgb(32,33,46)] items-center border-b border-b-[rgb(37,38,50)] w-full">
        <NavLink
          to={ROUTES.BOARD_DETAILS(project.slug, board.id)}
          className="text-base overflow-x-hidden whitespace-nowrap"
        >
          <div>{board.title}</div>
        </NavLink>
        <div className="text-gray-400">
          {board.tickets.filter((e) => e.status === "done").length}/
          {board.tickets.length}
        </div>
        {board.title !== "backlog" && (
          <Button
            onClick={toggleBoard.bind(null, board.id)}
            title={isBoardVisible ? "Hide" : "Show"}
          />
        )}
      </div>
      {isBoardVisible &&
        tickets.map((ticket: Ticket) => (
          <TicketRow
            key={ticket.id}
            project={project}
            ticket={ticket}
            onContextMenu={onContextMenu}
          />
        ))}
    </div>
  );
};

export default BoardSection;
