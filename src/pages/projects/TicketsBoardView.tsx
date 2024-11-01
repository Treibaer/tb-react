import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LoaderFunction, NavLink, useLoaderData, useLocation } from "react-router-dom";
import Button from "../../components/Button";
import ContextMenu from "../../components/contextmenu/ContextMenu";
import HeaderView from "../../components/HeaderView";
import BoardSection from "../../components/projects/tickets/BoardSection";
import TicketCreationDialog from "../../components/projects/tickets/TicketCreationDialog";
import TitleView from "../../components/TitleView";
import { Toggle } from "../../components/Toggle";
import { useSocket } from "../../hooks/useSocket";
import { Board, BoardStructure } from "../../models/board-structure";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { ProjectMeta } from "../../models/project-meta";
import { Ticket } from "../../models/ticket";
import { TicketsContextMenuConfig } from "../../models/tickets-context-menu-config";
import { ROUTES } from "../../routes";
import { BoardService } from "../../services/BoardService";
import ProjectService from "../../services/ProjectService";
import PartyComponent from "./PartyComponent";

const projectService = ProjectService.shared;
const boardService = BoardService.shared;

const TicketsBoardView: React.FC = () => {
  const initialRender = useRef(true);

  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState<TicketsContextMenuConfig>({
    top: 0,
    left: 0,
    show: false,
    ticket: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const data = useLoaderData() as {
    boardStructure: BoardStructure;
    metadata: ProjectMeta;
  };

  const [project, setProject] = useState<Project>(data.metadata.project);
  const [boardStructure, setBoardStructure] = useState<BoardStructure>(
    data.boardStructure
  );
  const [closedBoardIds, setClosedBoardIds] = useState<string[]>(
    data.boardStructure.closed
  );
  const [hideDone, setHideDone] = useState(data.boardStructure.hideDone);

  const { listenOn, listenOff, emit } = useSocket();

  useEffect(() => {
    listenOn("matches", "update", (_) => {
      updateBoardStructure();
    });
    return () => {
      listenOff("matches", "update");
    };
  }, []);

  // re-render on url change (loader data change)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    setProject(data.metadata.project);
    setBoardStructure(data.boardStructure);
    setClosedBoardIds(data.boardStructure.closed);
    setHideDone(data.boardStructure.hideDone);
  }, [data]);

  async function refresh() {
    await updateBoardStructure();
    emit("matches", "update", {});
  }

  function onContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();

    const board = boardStructure.activeBoards.find((b) =>
      b.tickets.find((t) => t.id === ticket.id)
    );
    const maxX = window.innerWidth - 175;
    const maxY = window.innerHeight - 175;
    setConfig({
      top: Math.min(e.pageY, maxY),
      left: Math.min(e.pageX, maxX),
      show: true,
      ticket,
      board,
    });
  }

  async function closeContextMenu(shouldUpdate: boolean) {
    setConfig({
      ...config,
      show: false,
      ticket: null,
    });
    if (shouldUpdate) {
      await refresh();
    }
  }

  async function updateBoardStructure() {
    const boardStructure = await boardService.getBoardStructure(project.slug);
    setBoardStructure(boardStructure);
    setClosedBoardIds(boardStructure.closed);
  }

  async function toggleBoard(boardId: number) {
    if (closedBoardIds.includes("" + boardId)) {
      setClosedBoardIds(closedBoardIds.filter((id) => id !== "" + boardId));
      await boardService.open(project.slug, boardId);
    } else {
      setClosedBoardIds([...closedBoardIds, "" + boardId]);
      await boardService.close(project.slug, boardId);
    }
    await refresh();
  }

  async function toggleHideDone() {
    setHideDone(!hideDone);
    await boardService.toggleHideDone(project.slug, !hideDone);
  }

  function isBoardVisible(boardId: number) {
    return !closedBoardIds.includes("" + boardId);
  }

  const activeBoards = boardStructure.activeBoards.filter(
    (b) => b.tickets.length > 0
  );

  // merge with boardStructure.backlog
  if (boardStructure.backlog.tickets.length > 0) {
    const backlogBoard = boardStructure.backlog as Board;
    backlogBoard.creator = { id: 0, firstName: "system", avatar: "" };
    activeBoards.push(backlogBoard);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Tickets", link: "" },
  ];

  function openDialog() {
    setIsCreating(true);
  }

  async function onClose(shouldUpdate: boolean) {
    setIsCreating(false);
    if (shouldUpdate) {
      await refresh();
      const updatedProject = await projectService.get(project.slug);
      setProject(updatedProject);
    }
  }

  const handleTouchStart = (event: React.TouchEvent, ticket: Ticket) => {
    if (event.touches.length !== 2) {
      return;
    }
    const board = boardStructure.activeBoards.find((b) =>
      b.tickets.find((t) => t.id === ticket.id)
    );
    const touch = event.touches[0];
    const touch1 = event.touches[1];
    const touchX = Math.min(touch.clientX, touch1.clientX);
    const touchY = Math.min(touch.clientY, touch1.clientY);
    setConfig({
      top: touchY,
      left: touchX,
      show: true,
      ticket,
      board,
    });
  };

  return (
    <>
    <PartyComponent />
      <AnimatePresence>
        {isCreating && (
          <TicketCreationDialog
            metadata={data.metadata}
            onClose={onClose}
            updateBoardView={refresh}
          />
        )}
      </AnimatePresence>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="overflow-auto max-h-[calc(100vh-57px)]">
        <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
          <TitleView title="Board View" openDialog={openDialog} />
          <div className="flex items-center gap-4 me-2 flex-col sm:flex-row my-2">
            <div className="flex gap-4">
              <Toggle
                title="Hide done"
                defaultChecked={hideDone}
                onChange={toggleHideDone}
              />
              <input
                type="text"
                placeholder="Search"
                className="bg-customBlue text-gray-400 rounded-md p-2"
                style={{ boxShadow: "none", outline: "none" }}
                onChange={handleSearch}
              />
            </div>
            <div className="hidden md:flex gap-4">
              <NavLink to={ROUTES.BOARDS(project.slug)}>
                <Button title="Boards" />
              </NavLink>

              <NavLink to={ROUTES.TICKETS_LIST(project.slug)}>
                <Button title="All Tickets" />
              </NavLink>
            </div>
          </div>
        </div>

        <div className="board-structure">
          {config.show && (
            <ContextMenu
              metadata={data.metadata}
              config={config}
              onClose={closeContextMenu}
            />
          )}
          {activeBoards.map((board: Board) => (
            <DndProvider backend={HTML5Backend} key={board.id}>
              <BoardSection
                board={board}
                isBoardVisible={isBoardVisible(board.id)}
                onContextMenu={onContextMenu}
                onTouchStart={handleTouchStart}
                toggleBoard={toggleBoard}
                hideDone={hideDone}
                searchTerm={searchTerm}
                project={project}
                reload={refresh}
              />
            </DndProvider>
          ))}
        </div>
      </div>
    </>
  );
};

export default TicketsBoardView;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const slug = params.projectSlug ?? "";
  const boardStructure = await boardService.getBoardStructure(slug);
  const metadata = await projectService.getMetadata(slug);
  return { boardStructure, metadata };
};
