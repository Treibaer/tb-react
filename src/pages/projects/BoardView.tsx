import { LoaderFunction, useLoaderData } from "react-router-dom";
import BoardTicketRow from "../../components/projects/board/BoardTicketRow";
import { Board } from "../../models/board-structure";
import ProjectService from "../../services/ProjectService";
import { Breadcrumb } from "../../models/breadcrumb";
import { ROUTES } from "../../routes";
import { Project } from "../../models/project";
import HeaderView from "../../components/HeaderView";

const projectService = ProjectService.shared;

export const BoardDetails: React.FC = () => {
  const { board, project } = useLoaderData() as {
    board: Board;
    project: Project;
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

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Boards", link: ROUTES.BOARDS(project.slug) },
    { title: board.title, link: "" },
  ];
  document.title = board.title;

  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-2xl p-2">{board.title}</div>
      <div className="flex mx-2 mt-2 gap-2">
        <div className="flex flex-col gap-2" style={{ flex: 1 }}>
          <h3>Open</h3>
          {openTickets.map((ticket) => (
            <BoardTicketRow
              key={ticket.id}
              ticket={ticket}
              projectSlug={project.slug}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2" style={{ flex: 1 }}>
          <h3>In Progress</h3>
          {inProgressTickets.map((ticket) => (
            <BoardTicketRow
              key={ticket.id}
              ticket={ticket}
              projectSlug={project.slug}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2" style={{ flex: 1 }}>
          <h3>Done</h3>
          {doneTickets.map((ticket) => (
            <BoardTicketRow
              key={ticket.id}
              ticket={ticket}
              projectSlug={project.slug}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BoardDetails;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const projectSlug = params.projectSlug ?? "";
  const boardId = parseInt(params.boardId ?? "0");
  const project = await projectService.getProject(projectSlug);
  const board = await projectService.getBoard(projectSlug, boardId);
  return { board, project };
};
