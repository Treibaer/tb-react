import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { ContextMenu } from "../../components/contextmenu/ContextMenu";
import HeaderView from "../../components/HeaderView";
import { BoardColumn } from "../../components/projects/board-details/BoardColumn";
import TicketCreationDialog from "../../components/projects/tickets/TicketCreationDialog";
import TitleView from "../../components/TitleView";
import useContextMenu from "../../hooks/useContextMenu";
import { useSocket } from "../../hooks/useSocket";
import { Board } from "../../models/board-structure";
import { Breadcrumb } from "../../models/breadcrumb";
import { ProjectMeta } from "../../models/project-meta";
import { ROUTES } from "../../routes";
import { BoardService } from "../../services/boardService";
import ProjectService from "../../services/projectService";

const projectService = ProjectService.shared;
const boardService = BoardService.shared;

export const BoardDetails: React.FC = () => {
  const { listenOn, listenOff, emit } = useSocket();
  const [isCreating, setIsCreating] = useState(false);
  const data = useLoaderData() as {
    board: Board;
    metadata: ProjectMeta;
  };

  const [board, setBoard] = useState<Board>(data.board);
  const { metadata } = data;
  const project = metadata.project;

  useEffect(() => {
    listenOn("matches", "update", updateBoard);
    return () => listenOff("matches", "update");
  }, []);

  function openDialog() {
    setIsCreating(true);
  }

  async function onClose(shouldUpdate: boolean) {
    if (shouldUpdate) {
      await refresh();
    }
    setIsCreating(false);
  }

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

  async function updateBoard() {
    const updatedBoard = await boardService.get(project.slug, board.id);
    setBoard(updatedBoard);
  }

  async function refresh() {
    await updateBoard();
    emit("matches", "update", {});
  }

  const { config, openContextMenu, openContextMenuTouch, closeContextMenu } =
    useContextMenu({ refresh });

  return (
    <>
      <AnimatePresence>
        {isCreating && (
          <TicketCreationDialog
            metadata={data.metadata}
            initialBoardId={board.id}
            onClose={onClose}
            updateBoardView={refresh}
          />
        )}
      </AnimatePresence>
      <DndProvider backend={HTML5Backend}>
        {config.show && (
          <ContextMenu
            metadata={metadata}
            config={config}
            onClose={closeContextMenu}
          />
        )}
        <HeaderView breadcrumbs={breadcrumbs} />
        <TitleView title={board.title} openDialog={openDialog} />
        <div className="flex mx-2 mt-2 gap-2">
          <BoardColumn
            status="open"
            project={project}
            tickets={openTickets}
            update={refresh}
            onContextMenu={openContextMenu}
            onTouchStart={openContextMenuTouch}
          />
          <BoardColumn
            status="inProgress"
            project={project}
            tickets={inProgressTickets}
            update={refresh}
            onContextMenu={openContextMenu}
            onTouchStart={openContextMenuTouch}
          />
          <BoardColumn
            status="done"
            project={project}
            tickets={doneTickets}
            update={refresh}
            onContextMenu={openContextMenu}
            onTouchStart={openContextMenuTouch}
          />
        </div>
      </DndProvider>
    </>
  );
};

export default BoardDetails;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const projectSlug = params.projectSlug ?? "";
  const boardId = parseInt(params.boardId ?? "0");
  const board = await boardService.get(projectSlug, boardId);
  const metadata = await projectService.getMetadata(projectSlug);
  return { board, metadata };
};
