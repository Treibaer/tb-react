import { useRef, useState } from "react";
import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import { Button } from "../../components/Button";
import Dialog from "../../components/common/Dialog";
import HeaderView from "../../components/HeaderView";
import { TicketRow } from "../../components/tickets/TicketRow";
import TitleView from "../../components/TitleView";
import { Toggle } from "../../components/Toggle";
import { Board, BoardStructure } from "../../models/board-structure";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { Ticket } from "../../models/ticket";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import { ContextMenu } from "../../components/contextmenu/ContextMenu";
import { ProjectMeta } from "../../models/project-meta";

const projectService = ProjectService.shared;

type Config = {
  top: number;
  left: number;
  show: boolean;
  ticket: Ticket | null;
};

const TicketsBoardView: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState<Config>({
    top: 0,
    left: 0,
    show: false,
    ticket: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const data = useLoaderData() as {
    tickets: Ticket[];
    project: Project;
    boardStructure: BoardStructure;
    metadata: ProjectMeta;
  };

  // const [tickets, setTickets] = useState<Ticket[]>(data.tickets);
  const [project, setProject] = useState<Project>(data.project);
  const [boardStructure, setBoardStructure] = useState<BoardStructure>(
    data.boardStructure
  );
  const [closedBoardIds, setClosedBoardIds] = useState<string[]>(
    data.boardStructure.closed
  );
  const [hideDone, setHideDone] = useState(data.boardStructure.hideDone);

  function openDialog() {
    setIsCreating(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  async function createTicket() {
    const title = inputRef.current?.value;
    if (!title) {
      return;
    }
    const newTicket: Ticket = {
      id: 0,
      ticketId: 0,
      slug: "",
      title,
      description: descriptionRef.current?.value ?? "",
      type: "",
      createdAt: 0,
      updatedAt: 0,
      status: "open",
      board: null,
      creator: null,
      assignee: null,
    };
    await projectService.createTicket(project.slug, newTicket);
    const boardStructure = await projectService.getBoardStructure(project.slug);
    const updatedProject = await projectService.getProject(project.slug);
    setBoardStructure(boardStructure);
    setProject(updatedProject);
    setIsCreating(false);
  }

  function onContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();

    setConfig({
      top: e.pageY,
      left: e.pageX,
      show: true,
      ticket,
    });
  }

  async function closeContextMenu(update: boolean) {
    setConfig({
      ...config,
      show: false,
      ticket: null,
    });
    if (update) {
      const boardStructure = await projectService.getBoardStructure(
        project.slug
      );
      setBoardStructure(boardStructure);
    }
  }

  async function toggleBoard(boardId: number) {
    if (closedBoardIds.includes("" + boardId)) {
      setClosedBoardIds(closedBoardIds.filter((id) => id !== "" + boardId));
      await projectService.openBoard(project.slug, boardId);
    } else {
      setClosedBoardIds([...closedBoardIds, "" + boardId]);
      await projectService.closeBoard(project.slug, boardId);
    }
  }

  async function toggleHideDone() {
    await projectService.toggleHideDone(project.slug, !hideDone);
    setHideDone(!hideDone);
  }

  function isBoardVisible(boardId: number) {
    return !closedBoardIds.includes("" + boardId);
  }

  // derive boards
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
  return (
    <>
      {isCreating && (
        <>
          <Dialog
            title={`${project.title} > Create ticket`}
            onClose={() => setIsCreating(false)}
            onSubmit={createTicket}
          >
            <input
              type="text"
              placeholder="Title"
              id="dialogTitle"
              className="tb-textarea"
              style={{
                boxShadow: "none",
                outline: "none",
              }}
              ref={inputRef}
            />
            <textarea
              placeholder="Description"
              id="dialogDescription"
              className="tb-textarea"
              style={{
                boxShadow: "none",
                outline: "none",
              }}
              ref={descriptionRef}
            ></textarea>
          </Dialog>
        </>
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
            // value={search}
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
            project={project}
            ticket={config.ticket!}
            metadata={data.metadata}
            config={config}
            onClose={closeContextMenu}
          />
        )}
        {activeBoards.map((board: Board) => (
          <div key={board.id} className="">
            <div className="flex first-letter:flex gap-3 px-4 h-11 bg-[rgb(32,33,46)] items-center border-b border-b-[rgb(37,38,50)]">
              <NavLink to={ROUTES.BOARD_DETAILS(project.slug, board.id)}>
                <div className="text-base">{board.title}</div>
              </NavLink>
              <div className="text-gray-400">
                {board.tickets.filter((e) => e.status === "done").length}/
                {board.tickets.length}
              </div>
              {board.title !== "backlog" && (
                <Button
                  onClick={toggleBoard.bind(null, board.id)}
                  title={isBoardVisible(board.id) ? "Hide" : "Show"}
                />
              )}
            </div>
            <div
              style={{
                display: isBoardVisible(board.id) ? "block" : "none",
              }}
            >
              {board.tickets
                .filter(
                  (t) =>
                    (!hideDone || t.status !== "done") &&
                    t.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((ticket: Ticket) => (
                  <TicketRow
                    key={ticket.id}
                    project={project}
                    ticket={ticket}
                    onContextMenu={onContextMenu}
                  />
                ))}
            </div>
          </div>
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

  const project = await projectService.getProject(slug);
  // const tickets = await projectService.getTickets(project.slug);
  const boardStructure = await projectService.getBoardStructure(project.slug);
  const metadata = await projectService.getProjectMetadata(project.slug);
  return { project, boardStructure, metadata };
};
