import { LoaderFunction, useLoaderData } from "react-router-dom";
import BoardTicketRow from "../../components/projects/board/BoardTicketRow";
import { Board } from "../../models/board-structure";
import ProjectService from "../../services/ProjectService";

const projectService = ProjectService.shared;

export const BoardDetails: React.FC = () => {
  const { board, projectSlug } = useLoaderData() as {
    board: Board;
    projectSlug: string;
  };

  const openTickets = board.tickets.filter(
    (ticket) => ticket.status === "open"
  );
  const inProgressTickets = board.tickets.filter(
    (ticket) => ticket.status === "inProgress"
  );
  const doneTickets = board.tickets.filter(
    (ticket) => ticket.status === "done"
  );

  return (
    <div>
      <h2>{board.title}</h2>
      <div style={{ display: "flex" }}>
        <div className="col" style={{ flex: 1 }}>
          <h3>Open</h3>
          {openTickets.map((ticket) => (
            <BoardTicketRow
              key={ticket.id}
              ticket={ticket}
              projectSlug={projectSlug}
            />
          ))}
        </div>
        <div className="col" style={{ flex: 1 }}>
          <h3>In Progress</h3>
          {inProgressTickets.map((ticket) => (
            <BoardTicketRow
              key={ticket.id}
              ticket={ticket}
              projectSlug={projectSlug}
            />
          ))}
        </div>
        <div className="col" style={{ flex: 1 }}>
          <h3>Done</h3>
          {doneTickets.map((ticket) => (
            <BoardTicketRow
              key={ticket.id}
              ticket={ticket}
              projectSlug={projectSlug}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardDetails;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const projectSlug = params.projectSlug ?? "";
  const boardId = parseInt(params.boardId ?? "0");
  const board = await projectService.getBoard(projectSlug, boardId);
  return { board, projectSlug };
};
