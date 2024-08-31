import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import Button from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
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

const projectService = ProjectService.shared;
const ticketService = TicketService.shared;

export default function TicketDetailView() {
  const data = useLoaderData() as {
    metadata: ProjectMeta;
    ticket: Ticket;
  };
  const { metadata } = data;
  const project = metadata.project;
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

  async function toggleEdit() {
    if (isEditing) {
      const title = currentTitle.current?.value;
      const description = currentDescription.current;
      const updatedTicket = await ticketService.update(
        project.slug,
        ticket.slug,
        { title, description }
      );
      setTicket(updatedTicket);
    }
    setIsEditing((prev) => !prev);
  }

  function update(ticket: Ticket) {
    setTicket(ticket);
  }

  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex">
        <div className="w-[calc(100%-240px)] h-[calc(100vh-56px)] overflow-auto max-h-full px-2 flex flex-col">
          <div className="border-b-[rgb(37,38,50)] border-b mb-4">
            <div className="flex h-12 items-center gap-2">
              {isEditing && (
                <input
                  ref={currentTitle}
                  type="text"
                  className="w-full bg-transparent text-2xl"
                  defaultValue={ticket.title}
                />
              )}
              {!isEditing && <div className="text-2xl">{ticket.title}</div>}
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
}> = async ({ params }) => {
  const projectSlug = params.projectSlug ?? "";
  const ticketSlug = params.ticketSlug ?? "";

  const metadata = await projectService.getMetadata(projectSlug);
  const ticket = await ticketService.get(projectSlug, ticketSlug);

  return { metadata, ticket };
};
