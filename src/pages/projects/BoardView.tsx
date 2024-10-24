import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { ContextMenu } from "../../components/contextmenu/ContextMenu";
import HeaderView from "../../components/HeaderView";
import { BoardColumn } from "../../components/projects/board-details/BoardColumn";
import { Board } from "../../models/board-structure";
import { Breadcrumb } from "../../models/breadcrumb";
import { ProjectMeta } from "../../models/project-meta";
import { Ticket } from "../../models/ticket";
import { ROUTES } from "../../routes";
import { BoardService } from "../../services/BoardService";
import ProjectService from "../../services/ProjectService";
import TicketCreationDialog from "../../components/projects/tickets/TicketCreationDialog";
import TitleView from "../../components/TitleView";
import { AnimatePresence } from "framer-motion";

const projectService = ProjectService.shared;
const boardService = BoardService.shared;

type Config = {
  top: number;
  left: number;
  show: boolean;
  ticket: Ticket | null;
};

export const BoardDetails: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const data = useLoaderData() as {
    board: Board;
    metadata: ProjectMeta;
  };

  const [board, setBoard] = useState<Board>(data.board);
  const { metadata } = data;
  const project = metadata.project;

  function openDialog() {
    setIsCreating(true);
  }

  async function onClose(shouldUpdate: boolean) {
    if (shouldUpdate) {
      await updateBoard();
    }
    setIsCreating(false);
  }

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

  function onContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();
    const maxX = window.innerWidth - 175;
    const maxY = window.innerHeight - 175;
    setConfig({
      top: Math.min(e.pageY, maxY),
      left: Math.min(e.pageX, maxX),
      show: true,
      ticket,
    });
  }

  async function updateBoard() {
    const updatedBoard = await boardService.get(project.slug, board.id);
    setBoard(updatedBoard);
  }

  async function closeContextMenu(update: boolean) {
    setConfig({
      ...config,
      show: false,
      ticket: null,
    });
    if (update) {
      await updateBoard();
    }
  }

  const handleTouchStart = (event: React.TouchEvent, ticket: Ticket) => {
    if (event.touches.length !== 2) {
      return;
    }
    const touch = event.touches[0];
    const touch1 = event.touches[1];
    const touchX = Math.min(touch.clientX, touch1.clientX);
    const touchY = Math.min(touch.clientY, touch1.clientY);
    setConfig({
      top: touchY,
      left: touchX,
      show: true,
      ticket,
    });
  };

  return (
    <>
      <AnimatePresence>
        {isCreating && (
          <TicketCreationDialog
            metadata={data.metadata}
            initialBoardId={board.id}
            onClose={onClose}
            updateBoardView={updateBoard}
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
            title="Open"
            project={project}
            tickets={openTickets}
            update={updateBoard}
            onContextMenu={onContextMenu}
            onTouchStart={handleTouchStart}
          />
          <BoardColumn
            status="inProgress"
            title="In Progress"
            project={project}
            tickets={inProgressTickets}
            update={updateBoard}
            onContextMenu={onContextMenu}
            onTouchStart={handleTouchStart}
          />
          <BoardColumn
            status="done"
            title="Done"
            project={project}
            tickets={doneTickets}
            update={updateBoard}
            onContextMenu={onContextMenu}
            onTouchStart={handleTouchStart}
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
