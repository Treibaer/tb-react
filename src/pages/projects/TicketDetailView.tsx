import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import HeaderView from "../../components/HeaderView";
import AssigneeDropdown from "../../components/ticket-details/AssigneeDropdown";
import BoardDropdown from "../../components/ticket-details/BoardDropdown";
import DescriptionView from "../../components/ticket-details/DescriptionView";
import StatusDropdown from "../../components/ticket-details/StatusDropdown";
import TicketAssigneeField from "../../components/ticket-details/TicketAssigneeField";
import TicketCommentArea from "../../components/ticket-details/TicketCommentArea";
import TypeDropdown from "../../components/ticket-details/TypeDropdown";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { ProjectMeta } from "../../models/project-meta";
import { Ticket } from "../../models/ticket";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import { FormatType, formatUnixTimestamp } from "../../utils/dataUtils";
import TicketStatus from "./TicketStatus";

const projectService = ProjectService.shared;

export default function TicketDetailView() {
  const data = useLoaderData() as {
    ticket: Ticket;
    project: Project;
  };
  const [metadata, setMetadata] = useState<ProjectMeta | null>(null);
  const project = data.project;
  const [ticket, setTicket] = useState<Ticket>(data.ticket);
  const currentDescription = useRef(ticket.description);

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Tickets", link: ROUTES.TICKETS_BOARD_VIEW(project.slug) },
    { title: ticket.slug, link: "" },
  ];

  function toggleStatusDropdown() {
    setShowStatusDropdown((prev) => !prev);
  }

  function toggleAssigneeDropdown() {
    setShowAssigneeDropdown((prev) => !prev);
  }

  function toggleTypeDropdown() {
    setshowTypeDropdown((prev) => !prev);
  }

  function toggleBoardDropdown() {
    setShowBoardDropdown((prev) => !prev);
  }

  useEffect(() => {
    async function loadMetadata() {
      const metadata = await ProjectService.shared.getProjectMetadata(
        project.slug
      );
      setMetadata(metadata);
    }

    loadMetadata();
  }, [project.slug]);

  async function updateStatus(status: string | null) {
    setShowStatusDropdown(false);
    if (status === null) {
      return;
    }
    if (status === "open" || status === "done" || status === "inProgress") {
      if (status !== ticket.status) {
        const updatedTicket = await projectService.updateTicketStatus(
          project.slug,
          ticket.slug,
          status
        );
        setTicket(updatedTicket);
      }
    }
  }

  async function updateAssignee(userId: number | null) {
    setShowAssigneeDropdown(false);
    if (userId === null) {
      return;
    }
    const updatedTicket = await projectService.updateAssignee(
      project.slug,
      ticket.slug,
      userId
    );
    setTicket(updatedTicket);
  }
  async function updateType(type: string | null) {
    setshowTypeDropdown(false);
    if (type === null) {
      return;
    }
    const updatedTicket = await projectService.updateType(
      project.slug,
      ticket.slug,
      type
    );
    setTicket(updatedTicket);
  }

  async function updateBoard(boardId: number | null) {
    setShowBoardDropdown(false);
    if (boardId === null) {
      return;
    }
    const updatedTicket = await projectService.updateBoard(
      project.slug,
      ticket.slug,
      boardId
    );
    setTicket(updatedTicket);
  }

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [showTypeDropdown, setshowTypeDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  async function toggleEdit() {
    if (isEditing) {
      const updatedTicket = await projectService.updateDescription(
        project.slug,
        ticket.slug,
        currentDescription.current
      );
      setTicket(updatedTicket);
    }
    setIsEditing((prev) => !prev);
  }

  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex">
        <div className="w-[calc(100%-240px)] h-[calc(100vh-56px)] overflow-auto max-h-full px-2 flex flex-col">
          <div className="border-b-[rgb(37,38,50)] border-b mb-4">
            <div className="flex h-12 items-center gap-2">
              <div className="text-2xl">{ticket.title}</div>
              <div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button title={"Save"} onClick={toggleEdit} />
                    <Button
                      title="Cancel"
                      onClick={() => {
                        setIsEditing(false);
                        currentDescription.current = ticket.description;
                      }}
                    />
                  </div>
                )}
                {!isEditing && (
                  <ButtonIcon onClick={toggleEdit}>
                    <PencilSquareIcon className="size-5" />
                  </ButtonIcon>
                )}
              </div>
            </div>
          </div>
          {!isEditing && (
            <p
              className="px-2 leading-7 flex-1 rawDescription"
              dangerouslySetInnerHTML={{ __html: ticket.description }}
            ></p>
          )}
          {isEditing && <DescriptionView description={currentDescription} />}
          <TicketCommentArea ticket={ticket} />
        </div>
        {/* Sidebar */}
        <div className="h-[calc(100vh-56px)] overflow-auto max-h-full bg-[rgb(32,33,46)] border-t border-t-[rgb(53,56,74)] border-r border-r-[rgb(53,56,74)] w-[254px] cursor-default">
          <div className="border-b border-b-[rgb(53,56,74)] px-4 h-14 flex items-center text-gray-400">
            {ticket.slug}
          </div>
          <div className="px-2 py-3 flex flex-col">
            <div className="flex items-center relative">
              {showStatusDropdown && <StatusDropdown onClose={updateStatus} />}
              <div className="min-w-20 h-8 px-2 text-gray-400 flex items-center ">
                Status
              </div>
              <div
                id="statusDropdown"
                className="select2-dropdown"
                onClick={toggleStatusDropdown}
              >
                <TicketStatus status={ticket.status} />
              </div>
            </div>
            <div className="flex items-center relative">
              {showAssigneeDropdown && (
                <AssigneeDropdown
                  users={metadata?.users ?? []}
                  onClose={updateAssignee}
                />
              )}
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400">
                Assignee
              </div>
              <div
                id="assigneeDropdown"
                className="select2-dropdown"
                onClick={toggleAssigneeDropdown}
              >
                <TicketAssigneeField user={ticket.assignee} />
              </div>
            </div>
            <div className="flex items-center relative">
              {showBoardDropdown && (
                <BoardDropdown
                  boards={metadata?.boards ?? []}
                  onClose={updateBoard}
                />
              )}
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400">Board</div>
              <div
                id="boardDropdown"
                className="select2-dropdown"
                onClick={toggleBoardDropdown}
              >
                {ticket.board?.title}
              </div>
            </div>
            <div className="flex items-center relative">
              {showTypeDropdown && (
                <TypeDropdown
                  types={metadata?.types ?? []}
                  onClose={updateType}
                />
              )}
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400">Type</div>
              <div
                id="typeDropdown"
                className="select2-dropdown"
                onClick={toggleTypeDropdown}
              >
                {ticket.type}
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex">
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400">
                Creator
              </div>
              <div className="min-w-20 h-8 py-1 px-2 text-white">
                <TicketAssigneeField user={ticket.creator} />
              </div>
            </div>
            <div className="flex">
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400">
                Created
              </div>
              <div
                className="min-w-20 h-8 py-1 px-2 text-white"
                title={formatUnixTimestamp(
                  ticket.createdAt,
                  FormatType.DAY_TIME
                )}
              >
                {formatUnixTimestamp(ticket.createdAt, FormatType.DAY)}
              </div>
            </div>
            <div className="flex">
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400">
                Changed
              </div>
              <div
                className="min-w-20 h-8 py-1 px-2 text-white"
                title={formatUnixTimestamp(
                  ticket.updatedAt,
                  FormatType.DAY_TIME
                )}
              >
                {formatUnixTimestamp(ticket.updatedAt, FormatType.DAY)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const loader: LoaderFunction<{
  projectSlug: string;
  ticketSlug: string;
}> = async ({ params }) => {
  const projectSlug = params.projectSlug ?? "";
  const ticketSlug = params.ticketSlug ?? "";

  const project = await projectService.getProject(projectSlug);
  const ticket = await projectService.getTicket(projectSlug, ticketSlug);

  return { project, ticket };
};
