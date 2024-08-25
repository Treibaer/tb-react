import { useState } from "react";
import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import { Button } from "../../components/Button";
import { ContextMenu } from "../../components/contextmenu/ContextMenu";
import HeaderView from "../../components/HeaderView";
import BoardSection from "../../components/tickets/BoardSection";
import TicketCreationDialog from "../../components/tickets/TicketCreationDialog";
import TitleView from "../../components/TitleView";
import { Toggle } from "../../components/Toggle";
import { Board, BoardStructure } from "../../models/board-structure";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { ProjectMeta } from "../../models/project-meta";
import { Ticket } from "../../models/ticket";
import { TicketsContextMenuConfig } from "../../models/tickets-context-menu-config";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import { BoardService } from "../../services/BoardService";

const projectService = ProjectService.shared;
const boardService = BoardService.shared;

const TicketsBoardView: React.FC = () => {
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

  function onContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();

    let board = boardStructure.activeBoards.find((b) =>
      b.tickets.find((t) => t.id === ticket.id)
    );

    setConfig({
      top: e.pageY,
      left: e.pageX,
      show: true,
      ticket,
      board,
    });
  }

  async function closeContextMenu(update: boolean) {
    setConfig({
      ...config,
      show: false,
      ticket: null,
    });
    if (update) {
      const boardStructure = await boardService.getBoardStructure(
        project.slug
      );
      setBoardStructure(boardStructure);
    }
  }

  async function toggleBoard(boardId: number) {
    if (closedBoardIds.includes("" + boardId)) {
      setClosedBoardIds(closedBoardIds.filter((id) => id !== "" + boardId));
      await boardService.open(project.slug, boardId);
    } else {
      setClosedBoardIds([...closedBoardIds, "" + boardId]);
      await boardService.close(project.slug, boardId);
    }
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

  async function onClose(update: boolean) {
    if (update) {
      const boardStructure = await boardService.getBoardStructure(
        project.slug
      );
      const updatedProject = await projectService.get(project.slug);
      setBoardStructure(boardStructure);
      setProject(updatedProject);
    }
    setIsCreating(false);
  }

  return (
    <>
      {isCreating && (
        <TicketCreationDialog project={project} onClose={onClose} />
      )}
      <HeaderView breadcrumbs={breadcrumbs} />

      <div className="flex justify-between items-center gap-4">
        <TitleView title="Board View" openDialog={openDialog} />
        <div className="flex items-center gap-4 me-2">
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
          <NavLink to={ROUTES.BOARDS(project.slug)}>
            <Button title="Boards" />
          </NavLink>

          <NavLink to={ROUTES.TICKETS_LIST(project.slug)}>
            <Button title="All Tickets" />
          </NavLink>
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
          <BoardSection
            board={board}
            isBoardVisible={isBoardVisible(board.id)}
            onContextMenu={onContextMenu}
            toggleBoard={toggleBoard}
            hideDone={hideDone}
            searchTerm={searchTerm}
            project={project}
          />
        ))}
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
