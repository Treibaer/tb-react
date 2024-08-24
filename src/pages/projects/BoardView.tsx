import { LoaderFunction, useLoaderData } from "react-router-dom";
import BoardTicketRow from "../../components/projects/board-details/BoardTicketRow";
import { Board } from "../../models/board-structure";
import ProjectService from "../../services/ProjectService";
import { Breadcrumb } from "../../models/breadcrumb";
import { ROUTES } from "../../routes";
import { Project } from "../../models/project";
import HeaderView from "../../components/HeaderView";
import { Ticket } from "../../models/ticket";
import { useState } from "react";
import { ContextMenu } from "../../components/contextmenu/ContextMenu";
import { ProjectMeta } from "../../models/project-meta";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { BoardColumn } from "../../components/projects/board-details/BoardColumn";

const projectService = ProjectService.shared;

type Config = {
  top: number;
  left: number;
  show: boolean;
  ticket: Ticket | null;
};

export const BoardDetails: React.FC = () => {
  const data = useLoaderData() as {
    board: Board;
    project: Project;
    metadata: ProjectMeta;
  };

  const [board, setBoard] = useState<Board>(data.board);
  const [project, setProject] = useState<Project>(data.project);
  const [metadata, setMetaData] = useState<ProjectMeta>(data.metadata);

  const [config, setConfig] = useState<Config>({
    top: 0,
    left: 0,
    show: false,
    ticket: null,
  });

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

  function onContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();
    setConfig({
      top: e.pageY,
      left: e.pageX,
      show: true,
      ticket,
    });
  }

  async function updateBoard() {
    const updatedBoard = await projectService.getBoard(project.slug, board.id);
    setBoard(updatedBoard);
  }

  async function closeContextMenu(update: boolean) {
    setConfig({
      ...config,
      show: false,
      ticket: null,
    });
    if (update) {
      const updatedBoard = await projectService.getBoard(
        project.slug,
        board.id
      );
      setBoard(updatedBoard);
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {config.show && (
        <ContextMenu
          project={project}
          metadata={metadata}
          config={config}
          onClose={closeContextMenu}
        />
      )}
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-2xl p-2">{board.title}</div>
      <div className="flex mx-2 mt-2 gap-2">
        <BoardColumn
          state="open"
          title="Open"
          project={project}
          tickets={openTickets}
          update={updateBoard}
          onContextMenu={onContextMenu}
        />
        <BoardColumn
          state="inProgress"
          title="In Progress"
          project={project}
          tickets={inProgressTickets}
          update={updateBoard}
          onContextMenu={onContextMenu}
        />
        <BoardColumn
          state="done"
          title="Done"
          project={project}
          tickets={doneTickets}
          update={updateBoard}
          onContextMenu={onContextMenu}
        />
      </div>
    </DndProvider>
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
  const metadata = await projectService.getProjectMetadata(projectSlug);
  return { board, project, metadata };
};
