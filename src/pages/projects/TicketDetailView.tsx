import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaPencil } from "react-icons/fa6";
import { LoaderFunction, useBlocker, useRevalidator } from "react-router-dom";
import Button from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import Confirmation from "../../components/common/Confirmation";
import ContextMenu from "../../components/contextmenu/ContextMenu";
import HeaderView from "../../components/HeaderView";
import DescriptionView from "../../components/projects/ticket-details/DescriptionView";
import TicketCommentArea from "../../components/projects/ticket-details/TicketCommentArea";
import TicketDetailsSidebar from "../../components/projects/ticket-details/TicketDetailsSidebar";
import TicketCreationDialog from "../../components/projects/tickets/TicketCreationDialog";
import TicketRowDnDWrapper from "../../components/projects/tickets/TicketRowDnDWrapper";
import useTicketData from "../../hooks/useTicketData";
import { Breadcrumb } from "../../models/breadcrumb";
import { Ticket } from "../../models/ticket";
import { TicketsContextMenuConfig } from "../../models/tickets-context-menu-config";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import TicketService from "../../services/TicketService";
import { showToast } from "../../utils/tbToast";

const projectService = ProjectService.shared;
const ticketService = TicketService.shared;

export default function TicketDetailView() {
  const {
    metadata,
    ticket,
    setTicket,
    history,
    isOldVersion,
    comments,
    fetchHistory,
  } = useTicketData();

  const currentTitle = useRef<HTMLInputElement | null>(null);
  const currentDescription = useRef(ticket.description);
  const [isEditing, setIsEditing] = useState(false);
  const project = metadata.project;
  const [config, setConfig] = useState<TicketsContextMenuConfig>({
    top: 0,
    left: 0,
    show: false,
    ticket: null,
  });

  const revalidator = useRevalidator();

  function onClose(updated: boolean) {
    if (updated) {
      revalidator.revalidate();
    }
    setIsCreating(false);
  }

  useEffect(() => {
    currentDescription.current = ticket.description;
    setIsEditing(false);
    setIsCreating(false);
  }, [ticket.slug]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent
  ) => {
    if (isEditing) {
      return;
    }
    if (
      document.activeElement &&
      ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
      return;
    }
    if (event.key === "e") {
      setIsEditing(true);
    }
    if (event.key === "c") {
      setIsCreating(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing]);

  let breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Tickets", link: ROUTES.TICKETS_BOARD_VIEW(project.slug) },
  ];

  if (ticket.parent) {
    breadcrumbs.push({
      title: ticket.parent.slug,
      link: ROUTES.TICKET_DETAILS(project.slug, ticket.parent.slug),
    });
  }

  breadcrumbs.push({ title: ticket.slug, link: "" });

  //

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      ticket.description !== currentDescription.current &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      if (ticket.description !== currentDescription.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [ticket]);

  async function toggleEdit() {
    if (isOldVersion) {
      return;
    }
    if (isEditing) {
      const title = currentTitle.current?.value;
      const description = currentDescription.current;
      const updatedTicket = await ticketService.update(
        project.slug,
        ticket.slug,
        { title, description }
      );
      setTicket(updatedTicket);
      showToast("success", ticket.slug, "Saved");
      await fetchHistory();
    } else {
    }
    setIsEditing((prev) => !prev);
    // wait 1ms for the state to update
    await new Promise((resolve) => setTimeout(resolve, 1));
    currentTitle.current?.focus();
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

  async function closeContextMenu(shouldUpdate: boolean) {
    setConfig({
      ...config,
      show: false,
      ticket: null,
    });
    if (shouldUpdate) {
      revalidator.revalidate();
    }
  }

  function update(ticket: Ticket) {
    setTicket(ticket);
  }
  const [isCreating, setIsCreating] = useState(false);

  const [dragIndex, setDragIndex] = useState(-1);
  const [hoverIndex, setHoverIndex] = useState(-1);

  async function moveTicket(dragIndex: number, hoverIndex: number) {
    if (dragIndex === hoverIndex) {
      return;
    }
    console.log("Moving subtask", dragIndex, hoverIndex);
    await TicketService.shared.moveSubtask(
      project.slug,
      ticket.slug,
      dragIndex,
      hoverIndex
    );
    revalidator.revalidate();
  }

  return (
    <>
      <AnimatePresence>
        {blocker.state === "blocked" ? (
          <Confirmation
            title="Unsaved changes"
            message="Are you sure you want to leave?"
            onConfirm={blocker.proceed}
            onCancel={blocker.reset}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {isCreating && (
          <TicketCreationDialog
            metadata={metadata}
            onClose={onClose}
            updateBoardView={revalidator.revalidate}
            parentId={ticket.id}
          />
        )}
        {config.show && (
          <ContextMenu
            metadata={metadata}
            config={config}
            onClose={closeContextMenu}
          />
        )}
      </AnimatePresence>
      <HeaderView
        title={`${ticket.slug} - ${ticket.title}`}
        breadcrumbs={breadcrumbs}
      />
      <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row">
        <div className="w-full sm:w-[calc(100%-240px)] sm:h-[calc(100vh-56px)] px-2 flex flex-col">
          <div className="border-b-border border-b mb-4 h-14 items-center flex w-full justify-between">
            {isOldVersion && (
              <div className="text-red-500 text-center">
                You are viewing an old version of this ticket
              </div>
            )}
            <div className="flex min-h-14 items-center gap-2 w-full">
              {isEditing && (
                <input
                  ref={currentTitle}
                  type="text"
                  className="w-full bg-hover text-2xl h-10 border border-border rounded-md px-2"
                  defaultValue={ticket.title}
                />
              )}
              {!isEditing && (
                <div className="text-2xl px-2 border border-transparent">
                  {ticket.title}
                </div>
              )}
              <div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button title="Save" onClick={toggleEdit} />
                    <Button
                      title="Cancel"
                      onClick={() => {
                        setIsEditing(false);
                        currentDescription.current = ticket.description;
                      }}
                    />
                  </div>
                )}
                {!isEditing && !isOldVersion && (
                  <ButtonIcon onClick={toggleEdit}>
                    <FaPencil className="size-5" />
                  </ButtonIcon>
                )}
              </div>
            </div>
          </div>
          {!isEditing && (
            <p
              className="px-2 leading-7 flex-1 rawDescription min-h-32 overflow-auto max-h-full text-wrap break-words"
              dangerouslySetInnerHTML={{ __html: ticket.description }}
            ></p>
          )}

          {isEditing && (
            <div className="h-64 sm:h-full overflow-auto max-h-full">
              <DescriptionView description={currentDescription} />
            </div>
          )}

          {ticket.children.length > 0 && (
            <DndProvider backend={HTML5Backend}>
              <div className="text-gray-400 mb-2 text-lg">Subtasks</div>
              {ticket.children.map((child) => (
                <div key={child.id}>
                  {/* <TicketRow project={project} ticket={child} /> */}
                  <TicketRowDnDWrapper
                    project={project}
                    ticket={child}
                    onContextMenu={onContextMenu}
                    onTouchStart={handleTouchStart}
                    dragIndex={dragIndex}
                    hoverIndex={hoverIndex}
                    setDragIndex={setDragIndex}
                    setHoverIndex={setHoverIndex}
                    index={child.id}
                    id={child.id}
                    moveTicket={moveTicket}
                  />
                </div>
              ))}
            </DndProvider>
          )}

          <TicketCommentArea
            project={project}
            ticket={ticket}
            comments={comments}
          />
        </div>
        <TicketDetailsSidebar
          metadata={metadata}
          ticket={ticket}
          history={history}
          update={update}
          addSubtask={() => setIsCreating(true)}
        />
      </div>
    </>
  );
}

export const loader: LoaderFunction<{
  projectSlug: string;
  ticketSlug: string;
}> = async ({ request, params }) => {
  const projectSlug = params.projectSlug ?? "";
  const ticketSlug = params.ticketSlug ?? "";

  const [ticket, metadata, history, comments] = await Promise.all([
    ticketService.get(projectSlug, ticketSlug),
    projectService.getMetadata(projectSlug),
    ticketService.getHistory(projectSlug, ticketSlug),
    ticketService.getComments(projectSlug, ticketSlug),
  ]);

  const queryParameters = new URL(request.url).searchParams;
  const version = queryParameters.get("version");

  let isOldVersion = false;

  const historyItem = history.find((h) => h.versionNumber === Number(version));
  if (historyItem) {
    ticket.description = historyItem.description;
    if (Number(version) < history.length) {
      isOldVersion = true;
    }
  }
  return { metadata, ticket, isOldVersion, history, comments };
};
