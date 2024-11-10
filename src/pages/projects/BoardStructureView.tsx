import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import Button from "../../components/Button";
import Dialog from "../../components/common/Dialog";
import ContextMenu from "../../components/contextmenu/ContextMenu";
import HeaderView from "../../components/HeaderView";
import BoardSection from "../../components/projects/tickets/BoardSection";
import TicketCreationDialog from "../../components/projects/tickets/TicketCreationDialog";
import TitleView from "../../components/TitleView";
import { Toggle } from "../../components/Toggle";
import useContextMenu from "../../hooks/useContextMenu";
import { useSocket } from "../../hooks/useSocket";
import { Board, BoardStructureDto } from "../../models/board-structure.dto";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { ProjectMeta } from "../../models/project-meta";
import { Ticket } from "../../models/ticket";
import { ROUTES } from "../../routes";
import { BoardService } from "../../services/boardService";
import ProjectService from "../../services/projectService";

const projectService = ProjectService.shared;
const boardService = BoardService.shared;

const BoardStructureView: React.FC = () => {
  const data = useLoaderData() as {
    boardStructure: BoardStructureDto;
    metadata: ProjectMeta;
  };

  const initialRender = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLInputElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState<Project>(data.metadata.project);
  const [ticketPreview, setTicketPreview] = useState<Ticket | null>(null);
  const [boardStructure, setBoardStructure] = useState<BoardStructureDto>(
    data.boardStructure
  );
  const [closedBoardIds, setClosedBoardIds] = useState<string[]>(
    data.boardStructure.closed
  );
  const [hideDone, setHideDone] = useState(data.boardStructure.hideDone);

  const { listenOn, listenOff, emit } = useSocket();

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent
  ) => {
    if (document.activeElement === inputRef.current) {
      return;
    }
    if (event.key === "c") {
      openDialog();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    listenOn("matches", "update", updateBoardStructure);
    return () => listenOff("matches", "update");
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

  const { config, openContextMenu, openContextMenuTouch, closeContextMenu } =
    useContextMenu({ refresh });

  const handleTouchStart = (event: React.TouchEvent, ticket: Ticket) => {
    const board = boardStructure.activeBoards.find((b) =>
      b.tickets.find((t) => t.id === ticket.id)
    );
    openContextMenuTouch(event, ticket, board);
  };

  async function updateBoardStructure() {
    const boardStructure = await boardService.getBoardStructure(project.slug);
    setBoardStructure(boardStructure);
    setClosedBoardIds(boardStructure.closed);
    setHideDone(boardStructure.hideDone);
    toggleRef.current!.value = boardStructure.hideDone ? "on" : "off";
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
    await refresh();
  }

  function isBoardVisible(boardId: number) {
    return !closedBoardIds.includes("" + boardId);
  }

  const activeBoards = boardStructure.activeBoards.filter(
    (b) => b.tickets.length > 0
  );

  // merge with boardStructure.inbox
  if (boardStructure.inbox.tickets.length > 0) {
    const inboxBoard = boardStructure.inbox as Board;
    inboxBoard.creator = { id: 0, firstName: "system", avatar: "" };
    activeBoards.push(inboxBoard);
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
  const [hoverIndex, setHoverIndex] = useState(-1);

  async function showPreview(ticket: Ticket) {
    setTicketPreview(ticket);
  }

  return (
    <>
      <AnimatePresence>
        {isCreating && (
          <TicketCreationDialog
            metadata={data.metadata}
            onClose={onClose}
            updateBoardView={refresh}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {ticketPreview && (
          <Dialog
            title={ticketPreview.title}
            submitTitle="Close"
            onClose={() => setTicketPreview(null)}
            onSubmit={() => setTicketPreview(null)}
          >
            <div className="my-2 max-h-[90vh] overflow-scroll">
              <p
                className="px-2 leading-7 flex-1 rawDescription min-h-32 overflow-auto max-h-full text-wrap break-words"
                dangerouslySetInnerHTML={{ __html: ticketPreview.description }}
              ></p>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="overflow-auto max-h-[calc(100vh-57px)]">
        <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
          <TitleView title="Board View" openDialog={openDialog} />
          <div className="flex items-center gap-4 me-2 flex-col sm:flex-row my-2">
            <div className="flex gap-4">
              <Toggle
                ref={toggleRef}
                title="Hide done"
                checked={hideDone}
                onChange={toggleHideDone}
              />
              <input
                type="text"
                ref={inputRef}
                placeholder="Search"
                className="bg-row border border-border text-text rounded-md p-2"
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
        <div className="board-structure px-2 bg-section">
          {config.show && (
            <ContextMenu
              metadata={data.metadata}
              config={config}
              onClose={closeContextMenu}
              showPreview={showPreview}
            />
          )}
          <DndProvider backend={HTML5Backend}>
            {activeBoards.map((board: Board) => (
              <BoardSection
                key={board.id}
                board={board}
                isBoardVisible={isBoardVisible(board.id)}
                onContextMenu={openContextMenu}
                onTouchStart={handleTouchStart}
                toggleBoard={toggleBoard}
                hideDone={hideDone}
                searchTerm={searchTerm}
                project={project}
                reload={refresh}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
              />
            ))}
          </DndProvider>
        </div>
      </div>
    </>
  );
};

export default BoardStructureView;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const slug = params.projectSlug ?? "";
  const [boardStructure, metadata] = await Promise.all([
    boardService.getBoardStructure(slug),
    projectService.getMetadata(slug),
  ]);
  return { boardStructure, metadata };
};
