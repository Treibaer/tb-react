import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { LoaderFunction, useBlocker, useRevalidator } from "react-router-dom";
import Button from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import Confirmation from "../../components/common/Confirmation";
import HeaderView from "../../components/HeaderView";
import DescriptionView from "../../components/projects/ticket-details/DescriptionView";
import TicketCommentArea from "../../components/projects/ticket-details/TicketCommentArea";
import TicketDetailsSidebar from "../../components/projects/ticket-details/TicketDetailsSidebar";
import TicketDetailsSubtasks from "../../components/projects/ticket-details/TicketDetailsSubtasks";
import TicketLinkDialog from "../../components/projects/ticket-details/TicketLinkDialog";
import TicketCreationDialog from "../../components/projects/tickets/TicketCreationDialog";
import { useSocket } from "../../hooks/useSocket";
import useTicketData from "../../hooks/useTicketData";
import { Breadcrumb } from "../../models/breadcrumb";
import { Ticket } from "../../models/ticket";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/projectService";
import TicketService from "../../services/ticketService";
import { showToast } from "../../utils/tbToast";
import { TicketLink } from "../../models/ticket-link";

const projectService = ProjectService.shared;
const ticketService = TicketService.shared;

export default function TicketDetailView() {
  const { listenOn, listenOff, emit } = useSocket();

  const {
    metadata,
    ticket,
    setTicket,
    history,
    isOldVersion,
    comments,
    fetchHistory,
    links,
  } = useTicketData();

  const revalidator = useRevalidator();

  const currentTitle = useRef<HTMLInputElement | null>(null);
  const currentDescription = useRef(ticket.description);
  const [isEditing, setIsEditing] = useState(false);
  const project = metadata.project;
  const [isCreating, setIsCreating] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  function onClose(update: boolean) {
    if (update) {
      refresh();
    }
    setIsCreating(false);
  }

  useEffect(() => {
    listenOn("matches", "update", revalidator.revalidate);
    return () => listenOff("matches", "update");
  }, []);

  useEffect(() => {
    currentDescription.current = ticket.description;
    setIsEditing(false);
    setIsCreating(false);
  }, [ticket.slug]);

  function refresh() {
    revalidator.revalidate();
    emit("matches", "update", {});
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isEditing) {
      if (
        event.key === "Enter" &&
        document.activeElement === currentTitle.current
      ) {
        toggleEdit();
      }
      return;
    }
    if (
      document.activeElement &&
      ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
      return;
    }
    if (event.key === "e") {
      toggleEdit();
    }
    if (event.key === "c" && !event.ctrlKey && !event.metaKey) {
      setIsCreating(true);
    }
    if (event.key === "l" && !event.ctrlKey && !event.metaKey) {
      setIsLinking(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
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
      update(updatedTicket);

      showToast("success", ticket.slug, "Saved");
      await fetchHistory();
    }
    setIsEditing((prev) => !prev);
    await new Promise((resolve) => setTimeout(resolve, 1));
    currentTitle.current?.focus();
  }

  function update(ticket: Ticket) {
    setTicket(ticket);
    emit("matches", "update", {});
  }

  async function unlinkTicket(link: TicketLink) {
    try {
      await ticketService.unlink(project.slug, link);
      showToast("success", "Unlink Ticket", "Ticket unlinked successfully");
      refresh();
    } catch (error: any) {
      showToast("error", "Unlink Ticket", error.message);
    }
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
      </AnimatePresence>
      <AnimatePresence>
        {isLinking && (
          <TicketLinkDialog
            projectSlug={project.slug}
            ticketSlug={ticket.slug}
            onClose={(update: boolean) => {
              if (update) {
                refresh();
              }
              setIsLinking(false);
            }}
          />
        )}
      </AnimatePresence>
      <HeaderView
        title={`${ticket.slug} - ${ticket.title}`}
        breadcrumbs={breadcrumbs}
      />
      <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row">
        <div className="w-full sm:w-[calc(100%-240px)] sm:h-[calc(100vh-56px)] px-2 flex flex-col">
          {isOldVersion && (
            <div className="text-red-400 text-center">
              You are viewing an old version of this ticket
            </div>
          )}
          <div className="border-b-border border-b mb-4 h-14 items-center flex w-full justify-between">
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
          <TicketDetailsSubtasks
            metadata={metadata}
            ticket={ticket}
            refresh={refresh}
          />
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
          links={links}
          update={update}
          addSubtask={() => setIsCreating(true)}
          linkTicket={() => setIsLinking(true)}
          unlinkTicket={unlinkTicket}
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

  const [ticket, metadata, history, comments, links] = await Promise.all([
    ticketService.get(projectSlug, ticketSlug),
    projectService.getMetadata(projectSlug),
    ticketService.getHistory(projectSlug, ticketSlug),
    ticketService.getComments(projectSlug, ticketSlug),
    ticketService.getLinks(projectSlug, ticketSlug),
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
  return { metadata, ticket, isOldVersion, history, comments, links };
};
