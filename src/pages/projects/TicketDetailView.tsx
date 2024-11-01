import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LoaderFunction, useBlocker, useLoaderData } from "react-router-dom";
import Button from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import Confirmation from "../../components/common/Confirmation";
import HeaderView from "../../components/HeaderView";
import DescriptionView from "../../components/projects/ticket-details/DescriptionView";
import TicketCommentArea from "../../components/projects/ticket-details/TicketCommentArea";
import TicketDetailsSidebar from "../../components/projects/ticket-details/TicketDetailsSidebar";
import { Breadcrumb } from "../../models/breadcrumb";
import { ProjectMeta } from "../../models/project-meta";
import { Ticket } from "../../models/ticket";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import TicketService from "../../services/TicketService";
import { showToast } from "../../utils/tbToast";

const projectService = ProjectService.shared;
const ticketService = TicketService.shared;

export default function TicketDetailView() {
  const data = useLoaderData() as {
    metadata: ProjectMeta;
    ticket: Ticket;
    isOldVersion: boolean;
  };
  const { metadata } = data;
  const project = metadata.project;
  const isOldVersion = data.isOldVersion;
  const [ticket, setTicket] = useState<Ticket>(data.ticket);
  const currentTitle = useRef<HTMLInputElement>(null);
  const currentDescription = useRef(ticket.description);
  const [isEditing, setIsEditing] = useState(false);

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Tickets", link: ROUTES.TICKETS_BOARD_VIEW(project.slug) },
    { title: ticket.slug, link: "" },
  ];

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      ticket.description !== currentDescription.current &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      console.log("beforeunload");
      console.log(ticket.description, currentDescription.current);
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
    }
    setIsEditing((prev) => !prev);
  }

  function update(ticket: Ticket) {
    setTicket(ticket);
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
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row">
        <div className="w-full sm:w-[calc(100%-240px)] sm:h-[calc(100vh-56px)] px-2 flex flex-col">
          <div className="border-b-borderBlue border-b mb-4">
            {isOldVersion && (
              <div className="text-red-500 text-center">
                You are viewing an old version of this ticket
              </div>
            )}
            <div className="flex min-h-12 items-center gap-2">
              {isEditing && (
                <input
                  ref={currentTitle}
                  type="text"
                  className="w-full bg-mediumBlue text-2xl border border-gray-400 rounded-md px-2"
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
                    <PencilSquareIcon className="size-5" />
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
            <div className="h-64 sm:h-full  overflow-auto max-h-full">
              <DescriptionView description={currentDescription} />
            </div>
          )}
          <TicketCommentArea project={project} ticket={ticket} />
        </div>
        <TicketDetailsSidebar
          metadata={metadata}
          ticket={ticket}
          update={update}
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

  const metadata = await projectService.getMetadata(projectSlug);
  const ticket = await ticketService.get(projectSlug, ticketSlug);

  const queryParameters = new URL(request.url).searchParams;
  const version = queryParameters.get("version");

  let isOldVersion = false;

  if (version) {
    const history = await ticketService.getHistory(projectSlug, ticketSlug);

    const historyItem = history.find(
      (h) => h.versionNumber === Number(version)
    );
    if (historyItem) {
      ticket.description = historyItem.description;
      if (Number(version) < history.length) {
        isOldVersion = true;
      }
    }
  }
  return { metadata, ticket, isOldVersion };
};
