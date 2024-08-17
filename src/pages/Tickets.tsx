import { useRef, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import Dialog from "../components/common/Dialog";
import { ContextMenu } from "../components/contextmenu/ContextMenu";
import { data as data2 } from "../components/contextmenu/data";
import { TicketRow } from "../components/tickets/TicketRow";
import { Project } from "../models/project";
import { Ticket } from "../models/ticket";
import ProjectService from "../services/ProjectService";
import { Board, BoardStructure } from "../models/board-structure";

const projectService = ProjectService.shared;

const Tickets: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    show: false,
  });

  const data = useLoaderData() as {
    tickets: Ticket[];
    project: Project;
    boardStructure: BoardStructure;
  };

  const [tickets, setTickets] = useState<Ticket[]>(data.tickets);
  const [project, setProject] = useState<Project>(data.project);
  const [boardStructure, setBoardStructure] = useState<BoardStructure>(
    data.boardStructure
  );
  const [closedBoardIds, setClosedBoardIds] = useState<string[]>(
    data.boardStructure.closed
  );

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
    const ticket: Ticket = {
      id: 0,
      ticketId: 0,
      slug: "",
      title,
      description: descriptionRef.current?.value ?? "",
      createdAt: 0,
      updatedAt: 0,
      status: "open",
      creator: null,
      assignee: null,
    };
    await projectService.createTicket(project.id, ticket);
    const tickets = await projectService.loadTickets(project.id);
    const updatedProject = await projectService.loadProject(project.id);
    setTickets(tickets);
    setProject(updatedProject);
    setIsCreating(false);
  }

  function onContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();
    setConfig({
      top: e.clientY,
      left: e.clientX,
      right: e.clientX,
      bottom: e.clientY,
      show: true,
    });
  }

  async function toggleBoard(boardId: number) {
    if (closedBoardIds.includes("" + boardId)) {
      setClosedBoardIds(closedBoardIds.filter((id) => id !== "" + boardId));
      await projectService.openBoard(boardId);
    } else {
      setClosedBoardIds([...closedBoardIds, "" + boardId]);
      await projectService.closeBoard(boardId);
    }
  }

  function isBoardVisible(boardId: number) {
    return !closedBoardIds.includes("" + boardId);
  }

  return (
    <>
      <ContextMenu data={data2} config={config} />
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
              ref={inputRef}
            />
            <textarea
              placeholder="Description"
              id="dialogDescription"
              className="tb-textarea"
              ref={descriptionRef}
            ></textarea>
          </Dialog>
        </>
      )}
      <h1>Tickets</h1>
      <button className="tb-button" onClick={openDialog}>
        Create
      </button>
      <div className="tickets-wrapper" style={{ display: "none" }}>
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            project={project}
            ticket={ticket}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
      <div className="board-structure">
        {boardStructure.activeBoards
          .filter((b: Board) => b.tickets.length > 0)
          .map((board: Board) => (
            <div key={board.id} className="column">
              <h2>{board.title}</h2>
              <button onClick={toggleBoard.bind(null, board.id)}>
                {isBoardVisible(board.id) ? "Hide" : "Show"}
              </button>
              <div
                className="tickets-wrapper"
                style={{
                  display: isBoardVisible(board.id)
                    ? "block"
                    : "none",
                }}
              >
                {board.tickets.map((ticket: Ticket) => (
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

export default Tickets;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const slug = params.projectSlug ?? "";

  const project = await projectService.loadProjectBySlug(slug);
  const tickets = await projectService.loadTickets(project.id);
  const boardStructure = await projectService.loadBoardStructure(project.slug);
  return { tickets, project, boardStructure };
};
